import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Smart Home IoT Monitoring & Control API",
    version: "1.0.0",
    description: "RESTful API documentation for Smart Home IoT System with realtime telemetry and device controls.",
    contact: {
      name: "IoT Engineering Team",
      email: "admin@smarthome.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        summary: "User Login",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "admin@smarthome.com" },
                  password: { type: "string", example: "123456" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "Successful login returning JWT token" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Get current authenticated user",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User information" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/devices": {
      get: {
        summary: "List all controllable devices (LED, Fan)",
        tags: ["Devices"],
        responses: {
          200: { description: "Array of devices" },
        },
      },
    },
    "/devices/{id}/status": {
      put: {
        summary: "Update device state (ON/OFF) with command flow",
        tags: ["Devices"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", enum: ["ON", "OFF"], example: "ON" },
                  timeout: { type: "boolean", example: false, description: "Simulate timeout > 5s" },
                },
                required: ["status"],
              },
            },
          },
        },
        responses: {
          200: { description: "Device status updated" },
        },
      },
    },
    "/sensors": {
      get: {
        summary: "List all sensors (AHT20, BH1750)",
        tags: ["Sensors"],
        responses: {
          200: { description: "List of sensors" },
        },
      },
    },
    "/sensors/data": {
      get: {
        summary: "Query sensor telemetry history with Smart Datetime Range precision",
        tags: ["Sensors"],
        parameters: [
          { name: "sensor", in: "query", schema: { type: "string" }, description: "Sensor name (AHT20, BH1750)" },
          { name: "type", in: "query", schema: { type: "string" }, description: "Metric type (TEMPERATURE, HUMIDITY, LIGHT)" },
          { name: "search", in: "query", schema: { type: "string" }, description: "Smart precision datetime e.g. 2026/08/19 07:30:25, 2026/08/19, 2026/08, 2026" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Paginated sensor historical telemetry records" },
        },
      },
    },
    "/actions": {
      get: {
        summary: "Get device action history with response times and timeout status",
        tags: ["Action History"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Paginated list of actions" },
        },
      },
      post: {
        summary: "Execute device action command",
        tags: ["Action History"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  deviceId: { type: "integer", example: 1 },
                  action: { type: "string", enum: ["ON", "OFF"], example: "ON" },
                  simulateTimeout: { type: "boolean", example: false },
                },
                required: ["deviceId", "action"],
              },
            },
          },
        },
        responses: {
          201: { description: "Action initiated and completed" },
        },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📑 Swagger API Docs available at /api-docs");
}
