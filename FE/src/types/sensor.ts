export interface Sensor {
  id: number;
  name: "AHT20" | "BH1750" | string;
  type: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | string;
  unit: "°C" | "%" | "lux" | string;
  status: "ACTIVE" | "INACTIVE" | "DISCONNECT";
  description?: string;
}

export interface SensorData {
  id: number;
  sensorId: number;
  sensorName: "AHT20" | "BH1750" | string;
  type: "temperature" | "humidity" | "light" | string;
  value: number;
  unit: "°C" | "%" | "lux" | string;
  timestamp: string; // yyyy/mm/dd hh:mm:ss
  rawDate?: string;
}

export interface LatestSensorReadings {
  temperature?: SensorData;
  humidity?: SensorData;
  light?: SensorData;
}
