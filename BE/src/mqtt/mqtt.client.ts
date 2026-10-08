import mqtt, { MqttClient } from "mqtt";
import { ENV } from "../config/env";
import prisma from "../config/database";
import { broadcastSensorUpdate, broadcastDeviceUpdate } from "../websocket/socket";
import { formatDateTime } from "../utils/datetime";

let mqttClient: MqttClient | null = null;

// Helper to extract numerical float from string like "32.4 *C", "60.2 %", "150.0 lx", etc.
function parseSensorValue(val: any): number | null {
  if (typeof val === "number") return isNaN(val) ? null : val;
  if (typeof val === "string") {
    const match = val.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (match) {
      const parsed = parseFloat(match[0]);
      return isNaN(parsed) ? null : parsed;
    }
  }
  return null;
}

export function initMQTTClient() {
  try {
    console.log(`📡 Connecting to MQTT Broker at ${ENV.MQTT_BROKER_URL}...`);

    mqttClient = mqtt.connect(ENV.MQTT_BROKER_URL, {
      username: ENV.MQTT_USERNAME || undefined,
      password: ENV.MQTT_PASSWORD || undefined,
      reconnectPeriod: 5000,
      connectTimeout: 5000,
    });

    mqttClient.on("connect", () => {
      console.log("✅ MQTT Client connected successfully to Broker!");

      // 1. Subscribe to custom BTL topics (khanh/*)
      mqttClient?.subscribe("khanh/Sensors");
      mqttClient?.subscribe("khanh/Device_respond");

      // 2. Subscribe to standard topics as fallback
      mqttClient?.subscribe("smarthome/sensors/temperature");
      mqttClient?.subscribe("smarthome/sensors/humidity");
      mqttClient?.subscribe("smarthome/sensors/light");
      mqttClient?.subscribe("smarthome/devices/+/status");
    });

    mqttClient.on("message", async (topic: string, message: Buffer) => {
      try {
        const payloadStr = message.toString();
        const now = new Date();

        // Case A: JSON format from BTL IOT ESP32 (Topic: khanh/Sensors)
        if (topic === "khanh/Sensors") {
          try {
            const data = JSON.parse(payloadStr);
            // Expected data: { temperature: "28.5 *C", humidity: "65.0 %", light: "450 lx" }
            const sensorMappings: { key: string; type: string }[] = [
              { key: "temperature", type: "TEMPERATURE" },
              { key: "humidity", type: "HUMIDITY" },
              { key: "light", type: "LIGHT" },
            ];

            for (const mapping of sensorMappings) {
              if (data[mapping.key] !== undefined) {
                const val = parseSensorValue(data[mapping.key]);
                if (val !== null) {
                  const sensor = await prisma.sensors.findFirst({
                    where: { type: mapping.type },
                  });

                  if (sensor) {
                    await prisma.dataSensor.create({
                      data: {
                        sensor_id: sensor.id,
                        value: val,
                        recorded_at: now,
                      },
                    });

                    broadcastSensorUpdate({
                      sensorId: sensor.id,
                      sensorName: sensor.name,
                      type: sensor.type.toLowerCase(),
                      value: val,
                      unit: sensor.unit,
                      timestamp: formatDateTime(now),
                    });
                  }
                }
              }
            }
          } catch (jsonErr) {
            console.error("❌ Failed to parse JSON from khanh/Sensors:", payloadStr);
          }
          return;
        }

        // Case B: JSON Device Response from BTL IOT ESP32 (Topic: khanh/Device_respond)
        if (topic === "khanh/Device_respond") {
          try {
            const data = JSON.parse(payloadStr);
            // Expected: { "LED1": "ON", "LED2": "OFF", "LED3": "OFF" }
            for (const [key, state] of Object.entries(data)) {
              const statusStr = String(state).toUpperCase();
              if (statusStr === "ON" || statusStr === "OFF") {
                const devName = key.toUpperCase(); // "LED1" or map to "LED"
                const device = await prisma.devices.findFirst({
                  where: {
                    OR: [
                      { name: devName },
                      { name: "LED" },
                      { name: "FAN" }
                    ]
                  }
                });

                if (device) {
                  await prisma.devices.update({
                    where: { id: device.id },
                    data: { status: statusStr },
                  });

                  broadcastDeviceUpdate({
                    id: device.id,
                    name: device.name,
                    type: device.type,
                    status: statusStr,
                    timestamp: formatDateTime(now),
                  });
                }
              }
            }
          } catch (jsonErr) {
            console.error("❌ Failed to parse JSON from khanh/Device_respond:", payloadStr);
          }
          return;
        }

        // Case C: Standard individual topics (smarthome/sensors/...)
        if (topic.startsWith("smarthome/sensors/")) {
          const typeStr = topic.split("/")[2]?.toUpperCase(); // TEMPERATURE, HUMIDITY, LIGHT
          const value = parseSensorValue(payloadStr);

          if (value !== null) {
            const sensor = await prisma.sensors.findFirst({
              where: { type: typeStr },
            });

            if (sensor) {
              await prisma.dataSensor.create({
                data: {
                  sensor_id: sensor.id,
                  value,
                  recorded_at: now,
                },
              });

              broadcastSensorUpdate({
                sensorId: sensor.id,
                sensorName: sensor.name,
                type: sensor.type.toLowerCase(),
                value,
                unit: sensor.unit,
                timestamp: formatDateTime(now),
              });
            }
          }
        }
      } catch (err) {
        console.error("Error processing MQTT message:", err);
      }
    });

    mqttClient.on("error", (err) => {
      console.warn("⚠️ MQTT Connection warning:", err.message);
    });
  } catch (error: any) {
    console.warn("⚠️ MQTT init skipped or broker unavailable:", error?.message);
  }
}

export function publishDeviceCommand(deviceName: string, action: string) {
  if (mqttClient && mqttClient.connected) {
    // 1. Publish standard individual command topic
    const topic = `smarthome/devices/${deviceName.toLowerCase()}/command`;
    mqttClient.publish(topic, action, { qos: 1 });

    // 2. Publish BTL IOT JSON format to khanh/Device_control
    const btlPayload: Record<string, string> = {};
    if (deviceName.toUpperCase().includes("LED")) {
      btlPayload["LED1"] = action;
    } else if (deviceName.toUpperCase().includes("FAN")) {
      btlPayload["LED2"] = action;
    } else {
      btlPayload[deviceName] = action;
    }
    mqttClient.publish("khanh/Device_control", JSON.stringify(btlPayload), { qos: 1 });

    console.log(`📤 Published MQTT command [${topic} & khanh/Device_control]: ${action}`);
  }
}
