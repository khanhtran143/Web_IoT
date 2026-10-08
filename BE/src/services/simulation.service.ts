import prisma from "../config/database";
import { broadcastSensorUpdate } from "../websocket/socket";
import { formatDateTime } from "../utils/datetime";

let simulationInterval: NodeJS.Timeout | null = null;

let currentTemp = 28.5;
let currentHum = 68.0;
let currentLight = 520;

export function startIoTSimulator(intervalMs = 2000) {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  console.log(`🤖 IoT Sensor Simulator started (interval: ${intervalMs}ms)`);

  simulationInterval = setInterval(async () => {
    try {
      // Simulate realistic natural drift
      const tempDelta = (Math.random() * 0.6 - 0.3);
      currentTemp = parseFloat(Math.min(35, Math.max(22, currentTemp + tempDelta)).toFixed(1));

      const humDelta = (Math.random() * 1.2 - 0.6);
      currentHum = parseFloat(Math.min(85, Math.max(45, currentHum + humDelta)).toFixed(1));

      const lightDelta = Math.floor(Math.random() * 20 - 10);
      currentLight = Math.min(1000, Math.max(100, currentLight + lightDelta));

      const now = new Date();
      const formattedTime = formatDateTime(now);

      let sensors: any[] = [];
      try {
        sensors = await prisma.sensors.findMany();
      } catch {
        // Fallback default sensors if DB is offline
        sensors = [
          { id: 1, name: "AHT20", type: "TEMPERATURE", unit: "°C" },
          { id: 2, name: "AHT20", type: "HUMIDITY", unit: "%" },
          { id: 3, name: "BH1750", type: "LIGHT", unit: "lux" },
        ];
      }

      if (sensors.length === 0) {
        sensors = [
          { id: 1, name: "AHT20", type: "TEMPERATURE", unit: "°C" },
          { id: 2, name: "AHT20", type: "HUMIDITY", unit: "%" },
          { id: 3, name: "BH1750", type: "LIGHT", unit: "lux" },
        ];
      }

      for (const s of sensors) {
        let val = currentTemp;
        if (s.type === "HUMIDITY") val = currentHum;
        if (s.type === "LIGHT") val = currentLight;

        // Save to database if connected
        try {
          await prisma.dataSensor.create({
            data: {
              sensor_id: s.id,
              value: val,
              recorded_at: now,
            },
          });
        } catch {
          // DB offline fallback
        }

        // Always broadcast realtime
        broadcastSensorUpdate({
          sensorId: s.id,
          sensorName: s.name,
          type: s.type.toLowerCase(),
          value: val,
          unit: s.unit,
          timestamp: formattedTime,
        });
      }
    } catch (err: any) {
      // Ignore errors
    }
  }, intervalMs);
}

export function stopIoTSimulator() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("🛑 IoT Sensor Simulator stopped.");
  }
}
