import apiClient from "./api";
import { MockSimulator } from "./mockSimulator";

export const authService = {
  async login(emailOrUsername: string, passwordPlain: string) {
    try {
      const response = await apiClient.post("/auth/login", {
        email: emailOrUsername,
        password: passwordPlain,
      });
      if (response.data?.success) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        return response.data.data;
      }
      throw new Error(response.data?.message || "Login failed");
    } catch (err: any) {
      // Fallback for standalone demo: check credentials
      if (
        (emailOrUsername === "khanhtq143@gmail.com" || emailOrUsername === "admin@smarthome.com" || emailOrUsername === "admin") &&
        passwordPlain === "123456"
      ) {
        const user = MockSimulator.getUser();
        const token = "mock_jwt_token_demo_123456";
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return { token, user };
      }
      throw new Error(err?.response?.data?.message || "Email hoặc mật khẩu không chính xác");
    }
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser() {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};
