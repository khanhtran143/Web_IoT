import { io, Socket } from "socket.io-client";
import { MockSimulator } from "./mockSimulator";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  getIsConnected() {
    return this.isConnected;
  }

  connect(onStatusChange?: (status: boolean) => void) {
    try {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 3000,
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        this.isConnected = true;
        console.log("⚡ Connected to WebSocket Server");
        if (onStatusChange) onStatusChange(true);
      });

      this.socket.on("disconnect", () => {
        this.isConnected = false;
        console.log("⚠️ Disconnected from WebSocket Server");
        if (onStatusChange) onStatusChange(false);
      });

      this.socket.on("connect_error", () => {
        this.isConnected = false;
        if (onStatusChange) onStatusChange(false);
      });
    } catch (e) {
      this.isConnected = false;
    }
  }

  onSensorUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("sensor:update", callback);
    }
    // Also subscribe to mock telemetry stream
    const unsubscribeMock = MockSimulator.subscribeSensor(callback);

    return () => {
      if (this.socket) this.socket.off("sensor:update", callback);
      unsubscribeMock();
    };
  }

  onDeviceUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("device:update", callback);
    }
    const unsubscribeMock = MockSimulator.subscribeDevice(callback);

    return () => {
      if (this.socket) this.socket.off("device:update", callback);
      unsubscribeMock();
    };
  }

  onActionUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("action:update", callback);
    }
    const unsubscribeMock = MockSimulator.subscribeAction(callback);

    return () => {
      if (this.socket) this.socket.off("action:update", callback);
      unsubscribeMock();
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
