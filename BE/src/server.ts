import http from "http";
import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { initSocketServer } from "./websocket/socket";
import { initMQTTClient } from "./mqtt/mqtt.client";
import { errorHandler } from "./middleware/error.middleware";
import { setupSwagger } from "./utils/swagger";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import deviceRoutes from "./routes/device.routes";
import sensorRoutes from "./routes/sensor.routes";
import actionRoutes from "./routes/action.routes";

const app = express();
const server = http.createServer(app);

// 1. Middlewares
app.use(
  cors({
    origin: ENV.CORS_ORIGIN === "*" ? true : [ENV.CORS_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Swagger API Documentation
setupSwagger(app);

// 3. Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Smart Home IoT Monitoring & Control Backend",
  });
});

// 4. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/actions", actionRoutes);

// 5. Global Error Handler
app.use(errorHandler);

// 6. Initialize Realtime WebSocket & MQTT
initSocketServer(server);
initMQTTClient();

// 7. Start HTTP Server
server.listen(ENV.PORT, () => {
  console.log(`
🚀 ======================================================== 🚀
    SMART HOME IoT MONITORING & CONTROL SERVER
    📡 REST API:       http://localhost:${ENV.PORT}/api
    📑 Swagger Docs:   http://localhost:${ENV.PORT}/api-docs
    ⚡ WebSocket:      ws://localhost:${ENV.PORT}
    🛡️  Environment:    ${process.env.NODE_ENV || "development"}
🚀 ======================================================== 🚀
  `);
});

export default server;
