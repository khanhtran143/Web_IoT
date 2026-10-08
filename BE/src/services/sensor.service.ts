import prisma from "../config/database";
import { formatDateTime, parseSmartDatetimeRange } from "../utils/datetime";

export interface SensorDataFilter {
  sensor?: string; // "AHT20" | "BH1750"
  type?: string;   // "TEMPERATURE" | "HUMIDITY" | "LIGHT"
  search?: string; // smart datetime or string
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: "id" | "recorded_at" | "value";
  sortOrder?: "asc" | "desc";
}

export class SensorService {
  static async getAllSensors() {
    return prisma.sensors.findMany({
      orderBy: { id: "asc" },
    });
  }

  static async getSensorById(id: number) {
    const sensor = await prisma.sensors.findUnique({
      where: { id },
    });
    if (!sensor) {
      throw new Error(`Sensor with ID ${id} not found`);
    }
    return sensor;
  }

  static async getSensorData(filter: SensorDataFilter) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filter.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    // 1. Sensor Name Filter
    if (filter.sensor) {
      where.sensor = {
        name: { equals: filter.sensor },
      };
    }

    // 2. Type Filter
    if (filter.type) {
      where.sensor = {
        ...where.sensor,
        type: { equals: filter.type.toUpperCase() },
      };
    }

    // 3. Smart Search & DateTime Precision Range
    if (filter.search && filter.search.trim()) {
      const searchStr = filter.search.trim();

      // Check if it's an ID search
      if (/^\d+$/.test(searchStr) && searchStr.length < 4) {
        where.id = parseInt(searchStr, 10);
      } else {
        // Try smart datetime range parsing
        const dateRange = parseSmartDatetimeRange(searchStr);

        if (dateRange) {
          where.recorded_at = {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          };
        } else {
          // If search is sensor name or value string
          const numVal = parseFloat(searchStr);
          if (!isNaN(numVal)) {
            where.value = numVal;
          } else {
            where.sensor = {
              OR: [
                { name: { contains: searchStr } },
                { type: { contains: searchStr.toUpperCase() } },
              ],
            };
          }
        }
      }
    }

    // 4. Explicit from & to range
    if (filter.from || filter.to) {
      where.recorded_at = {
        ...(where.recorded_at || {}),
        ...(filter.from ? { gte: new Date(filter.from) } : {}),
        ...(filter.to ? { lte: new Date(filter.to) } : {}),
      };
    }

    const total = await prisma.dataSensor.count({ where });

    const sortBy = filter.sortBy || "recorded_at";
    const sortOrder = filter.sortOrder || "desc";

    const records = await prisma.dataSensor.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        sensor: true,
      },
    });

    const formattedData = records.map((record) => ({
      id: record.id,
      sensorId: record.sensor_id,
      sensorName: record.sensor.name,
      type: record.sensor.type.toLowerCase(),
      value: record.value,
      unit: record.sensor.unit,
      timestamp: formatDateTime(record.recorded_at),
      rawDate: record.recorded_at.toISOString(),
    }));

    return {
      items: formattedData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getLatestReadings() {
    const sensors = await prisma.sensors.findMany();
    const latestReadings: Record<string, any> = {};

    for (const sensor of sensors) {
      const latest = await prisma.dataSensor.findFirst({
        where: { sensor_id: sensor.id },
        orderBy: { recorded_at: "desc" },
      });

      if (latest) {
        latestReadings[sensor.type.toLowerCase()] = {
          sensorId: sensor.id,
          sensorName: sensor.name,
          type: sensor.type.toLowerCase(),
          value: latest.value,
          unit: sensor.unit,
          timestamp: formatDateTime(latest.recorded_at),
        };
      }
    }

    return latestReadings;
  }
}
