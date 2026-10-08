import prisma from "../config/database";
import { broadcastDeviceUpdate } from "../websocket/socket";
import { formatDateTime } from "../utils/datetime";

export class DeviceService {
  static async getAllDevices() {
    return prisma.devices.findMany({
      orderBy: { id: "asc" },
    });
  }

  static async getDeviceById(id: number) {
    const device = await prisma.devices.findUnique({
      where: { id },
    });
    if (!device) {
      throw new Error(`Device with ID ${id} not found`);
    }
    return device;
  }

  static async updateDeviceStatus(id: number, status: "ON" | "OFF" | "LOADING" | "DISCONNECT") {
    const device = await prisma.devices.update({
      where: { id },
      data: { status },
    });

    broadcastDeviceUpdate({
      id: device.id,
      name: device.name,
      type: device.type,
      status: device.status,
      timestamp: formatDateTime(new Date()),
    });

    return device;
  }
}
