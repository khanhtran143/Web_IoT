import prisma from "../config/database";
import { formatDateTime, parseSmartDatetimeRange } from "../utils/datetime";
import { broadcastActionUpdate, broadcastDeviceUpdate } from "../websocket/socket";
import { publishDeviceCommand } from "../mqtt/mqtt.client";

export class ActionService {
  static async getAllActions(params: {
    page?: number;
    limit?: number;
    search?: string;
    time?: string;
    device?: string;
    action?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.device) {
      where.device = { name: { equals: params.device.toUpperCase() } };
    }

    if (params.action) {
      where.action = params.action.toUpperCase();
    }

    if (params.status) {
      where.status = params.status.toUpperCase();
    }

    // Time search with smart datetime range
    const timeQuery = params.time || (params.search && /^\d{4}/.test(params.search.trim()) ? params.search : undefined);
    if (timeQuery && timeQuery.trim()) {
      const dateRange = parseSmartDatetimeRange(timeQuery.trim());
      if (dateRange) {
        where.activation_time = {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        };
      }
    }

    // General text search
    if (params.search && params.search.trim() && !where.activation_time) {
      const searchStr = params.search.trim();
      where.OR = [
        { device: { name: { contains: searchStr } } },
        { action: { contains: searchStr.toUpperCase() } },
        { status: { contains: searchStr.toUpperCase() } },
      ];
    }

    const total = await prisma.action.count({ where });

    const sortBy = params.sortBy || "activation_time";
    const sortOrder = params.sortOrder || "desc";

    const records = await prisma.action.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        device: true,
        user: {
          select: { id: true, username: true, full_name: true },
        },
      },
    });

    const formatted = records.map((act) => {
      const respSec = act.response_time !== null ? (act.response_time / 1000).toFixed(1) + "s" : "-";
      return {
        id: act.id,
        userId: act.user_id,
        userName: act.user?.full_name || "User",
        deviceId: act.device_id,
        deviceName: act.device?.name || "Device",
        action: act.action,
        status: act.status,
        activationTime: formatDateTime(act.activation_time),
        responseTimeMs: act.response_time,
        responseTime: respSec,
        responseAt: act.response_at ? formatDateTime(act.response_at) : null,
        isDisconnect: act.status === "DISCONNECT" || (act.response_time !== null && act.response_time > 5000),
      };
    });

    return {
      items: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async triggerAction(userId: number, deviceId: number, action: "ON" | "OFF", simulateTimeout = false) {
    const device = await prisma.devices.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new Error(`Device with ID ${deviceId} not found`);
    }

    const activationTime = new Date();

    // 1. Create Action in LOADING state
    const actionRecord = await prisma.action.create({
      data: {
        user_id: userId,
        device_id: deviceId,
        action,
        status: "LOADING",
        activation_time: activationTime,
      },
    });

    // 2. Broadcast LOADING state
    broadcastActionUpdate({
      id: actionRecord.id,
      userId,
      deviceId: device.id,
      deviceName: device.name,
      action,
      status: "LOADING",
      activationTime: formatDateTime(activationTime),
      responseTime: null,
      responseAt: null,
    });

    // 3. Publish to MQTT if connected
    publishDeviceCommand(device.name, action);

    // 4. Handle response flow (Hardware delay simulation: 1.5s - 2.8s for normal, > 5s for timeout)
    const simulatedDelayMs = simulateTimeout
      ? 7200
      : Math.floor(1600 + Math.random() * 1200); // e.g. 1800ms - 2800ms

    return new Promise((resolve) => {
      setTimeout(async () => {
        const responseAt = new Date(activationTime.getTime() + simulatedDelayMs);
        const isTimeout = simulatedDelayMs > 5000;
        const finalStatus = isTimeout ? "DISCONNECT" : action;

        // Update Action in DB
        const updatedAction = await prisma.action.update({
          where: { id: actionRecord.id },
          data: {
            status: finalStatus,
            response_time: simulatedDelayMs,
            response_at: responseAt,
          },
          include: { device: true },
        });

        // Update Device status in DB
        const updatedDevice = await prisma.devices.update({
          where: { id: deviceId },
          data: { status: finalStatus },
        });

        // Broadcast final updates via WebSocket
        broadcastActionUpdate({
          id: updatedAction.id,
          userId,
          deviceId: device.id,
          deviceName: device.name,
          action,
          status: finalStatus,
          activationTime: formatDateTime(activationTime),
          responseTime: simulatedDelayMs,
          responseAt: formatDateTime(responseAt),
        });

        broadcastDeviceUpdate({
          id: updatedDevice.id,
          name: updatedDevice.name,
          type: updatedDevice.type,
          status: updatedDevice.status,
          timestamp: formatDateTime(responseAt),
        });

        resolve({
          id: updatedAction.id,
          deviceId: updatedDevice.id,
          deviceName: updatedDevice.name,
          action: updatedAction.action,
          status: finalStatus,
          activationTime: formatDateTime(activationTime),
          responseTime: (simulatedDelayMs / 1000).toFixed(1) + "s",
          responseTimeMs: simulatedDelayMs,
          isDisconnect: isTimeout,
        });
      }, Math.min(simulatedDelayMs, 3000)); // Return within reasonable HTTP request timeframe
    });
  }
}
