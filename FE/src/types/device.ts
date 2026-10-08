export type DeviceStatus = "ON" | "OFF" | "LOADING" | "DISCONNECT";

export interface Device {
  id: number;
  name: "LED" | "FAN" | string;
  type: "LIGHT" | "FAN" | string;
  status: DeviceStatus;
  description?: string;
  lastUpdated?: string;
}
