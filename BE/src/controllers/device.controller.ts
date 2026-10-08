import { Request, Response } from "express";
import { DeviceService } from "../services/device.service";
import { ActionService } from "../services/action.service";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

export class DeviceController {
  static async getAll(req: Request, res: Response) {
    try {
      const devices = await DeviceService.getAllDevices();
      return sendSuccess(res, devices, "Devices retrieved successfully");
    } catch (error: any) {
      return sendError(res, error.message, 500, "SERVER_ERROR");
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const device = await DeviceService.getDeviceById(id);
      return sendSuccess(res, device, "Device retrieved successfully");
    } catch (error: any) {
      return sendError(res, error.message, 404, "NOT_FOUND");
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { status, timeout } = req.body;

      if (!status || !["ON", "OFF"].includes(status)) {
        return sendError(res, "Status must be 'ON' or 'OFF'", 400, "INVALID_STATUS");
      }

      const userId = req.user?.id || 1;
      const result = await ActionService.triggerAction(userId, id, status, !!timeout);

      return sendSuccess(res, result, `Device ${status} command processed`);
    } catch (error: any) {
      return sendError(res, error.message, 500, "COMMAND_ERROR");
    }
  }
}
