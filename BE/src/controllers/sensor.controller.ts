import { Request, Response } from "express";
import { SensorService } from "../services/sensor.service";
import { sendSuccess, sendError } from "../utils/response";

export class SensorController {
  static async getAll(req: Request, res: Response) {
    try {
      const sensors = await SensorService.getAllSensors();
      return sendSuccess(res, sensors, "Sensors retrieved successfully");
    } catch (error: any) {
      return sendError(res, error.message, 500, "SERVER_ERROR");
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const sensor = await SensorService.getSensorById(id);
      return sendSuccess(res, sensor, "Sensor retrieved successfully");
    } catch (error: any) {
      return sendError(res, error.message, 404, "NOT_FOUND");
    }
  }

  static async getData(req: Request, res: Response) {
    try {
      const { sensor, type, search, from, to, page, limit, sortBy, sortOrder } = req.query;

      const result = await SensorService.getSensorData({
        sensor: sensor ? String(sensor) : undefined,
        type: type ? String(type) : undefined,
        search: search ? String(search) : undefined,
        from: from ? String(from) : undefined,
        to: to ? String(to) : undefined,
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 10,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
      });

      return sendSuccess(
        res,
        result.items,
        "Sensor data retrieved successfully",
        200,
        result.pagination
      );
    } catch (error: any) {
      return sendError(res, error.message, 500, "SERVER_ERROR");
    }
  }

  static async getLatest(req: Request, res: Response) {
    try {
      const latest = await SensorService.getLatestReadings();
      return sendSuccess(res, latest, "Latest sensor readings retrieved");
    } catch (error: any) {
      return sendError(res, error.message, 500, "SERVER_ERROR");
    }
  }
}
