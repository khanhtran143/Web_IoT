import { Request, Response } from "express";
import { ActionService } from "../services/action.service";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

export class ActionController {
  static async getAll(req: Request, res: Response) {
    try {
      const { page, limit, search, time, device, action, status, sortBy, sortOrder } = req.query;

      const result = await ActionService.getAllActions({
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 10,
        search: search ? String(search) : undefined,
        time: time ? String(time) : undefined,
        device: device ? String(device) : undefined,
        action: action ? String(action) : undefined,
        status: status ? String(status) : undefined,
        sortBy: sortBy ? String(sortBy) : undefined,
        sortOrder: sortOrder as any,
      });

      return sendSuccess(
        res,
        result.items,
        "Action history retrieved successfully",
        200,
        result.pagination
      );
    } catch (error: any) {
      return sendError(res, error.message, 500, "SERVER_ERROR");
    }
  }

  static async createAction(req: AuthRequest, res: Response) {
    try {
      const { deviceId, action, simulateTimeout } = req.body;

      if (!deviceId || !action) {
        return sendError(res, "deviceId and action are required", 400, "VALIDATION_ERROR");
      }

      if (!["ON", "OFF"].includes(action)) {
        return sendError(res, "action must be 'ON' or 'OFF'", 400, "INVALID_ACTION");
      }

      const userId = req.user?.id || 1;
      const result = await ActionService.triggerAction(
        userId,
        parseInt(deviceId, 10),
        action,
        !!simulateTimeout
      );

      return sendSuccess(res, result, "Action executed successfully", 201);
    } catch (error: any) {
      return sendError(res, error.message, 500, "ACTION_FAILED");
    }
  }
}
