import apiClient from "./api";
import { MockSimulator } from "./mockSimulator";
import { Device } from "../types/device";

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    try {
      const response = await apiClient.get("/devices");
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (e) {
      // fallback
    }
    return MockSimulator.getDevices();
  },

  async updateDeviceStatus(deviceId: number, status: "ON" | "OFF", simulateTimeout = false) {
    try {
      const response = await apiClient.put(`/devices/${deviceId}/status`, {
        status,
        timeout: simulateTimeout,
      });
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (e) {
      // fallback
    }
    return MockSimulator.executeDeviceAction(deviceId, status, simulateTimeout);
  },
};
