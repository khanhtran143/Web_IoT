import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ENV } from "../config/env";

let io: Server | null = null;

export function initSocketServer(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CORS_ORIGIN === "*" ? "*" : [ENV.CORS_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Client connected to WebSocket: ${socket.id}`);

    // Send initial system status
    socket.emit("system:status", {
      status: "Connected",
      timestamp: new Date().toISOString(),
      activeClients: io?.engine.clientsCount || 1,
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected from WebSocket: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
}

export function broadcastSensorUpdate(payload: {
  sensorId: number;
  sensorName: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
}) {
  if (io) {
    io.emit("sensor:update", payload);
  }
}

export function broadcastDeviceUpdate(payload: {
  id: number;
  name: string;
  type: string;
  status: string;
  timestamp: string;
}) {
  if (io) {
    io.emit("device:update", payload);
  }
}

export function broadcastActionUpdate(payload: {
  id: number;
  userId: number;
  deviceId: number;
  deviceName: string;
  action: string;
  status: string;
  activationTime: string;
  responseTime: number | null;
  responseAt: string | null;
}) {
  if (io) {
    io.emit("action:update", payload);
  }
}
