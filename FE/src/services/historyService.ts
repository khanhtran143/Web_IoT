import apiClient from "./api";
import { MockSimulator } from "./mockSimulator";
import { ActionHistory } from "../types/action";

export interface GetActionHistoryParams {
  search?: string;
  time?: string;
  device?: string;
  action?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const historyService = {
  async getActions(params: GetActionHistoryParams) {
    try {
      const response = await apiClient.get("/actions", { params });
      if (response.data?.success) {
        return {
          items: response.data.data as ActionHistory[],
          pagination: response.data.pagination,
        };
      }
    } catch (e) {
      // fallback
    }
    return MockSimulator.getActionHistory(params);
  },

  async createAction(deviceId: number, action: "ON" | "OFF", simulateTimeout = false) {
    try {
      const response = await apiClient.post("/actions", {
        deviceId,
        action,
        simulateTimeout,
      });
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (e) {
      // fallback
    }
    return MockSimulator.executeDeviceAction(deviceId, action, simulateTimeout);
  },
};
