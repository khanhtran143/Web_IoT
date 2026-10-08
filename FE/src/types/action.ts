export type ActionType = "ON" | "OFF";
export type ActionStatus = "ON" | "OFF" | "LOADING" | "DISCONNECT";

export interface ActionHistory {
  id: number;
  userId?: number;
  userName?: string;
  deviceId: number;
  deviceName: "LED" | "FAN" | string;
  action: ActionType;
  status: ActionStatus;
  activationTime: string; // yyyy/mm/dd hh:mm:ss
  responseTime: string;   // e.g. "2.4s" or "-"
  responseTimeMs: number | null;
  responseAt?: string | null;
  isDisconnect?: boolean;
}
