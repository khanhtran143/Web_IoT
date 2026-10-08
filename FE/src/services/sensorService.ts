import apiClient from "./api";
import { MockSimulator } from "./mockSimulator";
import { SensorData } from "../types/sensor";

export interface GetSensorDataParams {
  search?: string;
  sensor?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const sensorService = {
  async getLatestReadings() {
    try {
      const response = await apiClient.get("/sensors/latest");
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (e) {
      // fallback
    }
    return MockSimulator.getLatestReadings();
  },

  async getSensorData(params: GetSensorDataParams) {
    try {
      const response = await apiClient.get("/sensors/data", { params });
      if (response.data?.success) {
        return {
          items: response.data.data as SensorData[],
          pagination: response.data.pagination,
        };
      }
    } catch (e) {
      // fallback
    }
    return MockSimulator.getSensorData(params);
  },
};
