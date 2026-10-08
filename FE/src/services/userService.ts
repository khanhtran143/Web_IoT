import apiClient from "./api";
import { MockSimulator } from "./mockSimulator";
import { UserProfile } from "../types/user";

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get("/users/me");
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (e) {
      // fallback to mock
    }
    return MockSimulator.getUser();
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put("/users/me", data);
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (e) {
      // fallback
    }
    return MockSimulator.updateUser(data);
  },
};
