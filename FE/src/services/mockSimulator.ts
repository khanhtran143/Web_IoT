import { SensorData } from "../types/sensor";
import { Device } from "../types/device";
import { ActionHistory } from "../types/action";
import { UserProfile } from "../types/user";
import { formatDateTime, parseSmartDatetime } from "../utils/datetime";

// In-memory Mock State
let mockUser: UserProfile = {
  id: 1,
  username: "admin",
  email: "khanhtq143@gmail.com",
  full_name: "Trần Quốc Khánh",
  student_id: "B23DCAT150",
  class: "D23CQAT05-B",
  major: "IoT & Embedded Systems",
  avatar: "/avatar.jpg",
  github_url: "https://github.com/smarthome-iot/iot-dashboard",
  figma_url: "https://figma.com/@smarthome-design",
  postman_url: "https://postman.com/smarthome-iot-api",
  pdf_report_url: "/documents/Bao_cao_IoT.pdf",
};

function getStoredDevices(): Device[] {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("devices") : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    { id: 1, name: "LED", type: "LIGHT", status: "ON", description: "Đèn LED Smart Living Room" },
    { id: 2, name: "FAN", type: "FAN", status: "OFF", description: "Quạt làm mát thông minh" },
  ];
}

let mockDevices: Device[] = getStoredDevices();

function getStoredSensorHistory(): SensorData[] {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("mock_sensor_history") : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function getStoredActionHistory(): ActionHistory[] {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("mock_action_history") : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

let mockSensorHistory: SensorData[] = getStoredSensorHistory();
let mockActionHistory: ActionHistory[] = getStoredActionHistory();

function saveMockData() {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mock_sensor_history", JSON.stringify(mockSensorHistory));
      localStorage.setItem("mock_action_history", JSON.stringify(mockActionHistory));
    }
  } catch {}
}

// Mock simulator subscribers
type Listener = (data: any) => void;
const sensorListeners: Set<Listener> = new Set();
const deviceListeners: Set<Listener> = new Set();
const actionListeners: Set<Listener> = new Set();
const simStatusListeners: Set<(isSimulating: boolean) => void> = new Set();

let autoSimInterval: any = null;

// Determine initial latest sensor values from history if available
const latestTempRecord = mockSensorHistory.find((s) => s.type.toLowerCase() === "temperature");
const latestHumRecord = mockSensorHistory.find((s) => s.type.toLowerCase() === "humidity");
const latestLightRecord = mockSensorHistory.find((s) => s.type.toLowerCase() === "light");

let lastTemp: number | null = latestTempRecord ? latestTempRecord.value : null;
let lastHum: number | null = latestHumRecord ? latestHumRecord.value : null;
let lastLight: number | null = latestLightRecord ? latestLightRecord.value : null;

export const MockSimulator = {
  getUser: () => mockUser,
  updateUser: (data: Partial<UserProfile>) => {
    mockUser = { ...mockUser, ...data };
    return mockUser;
  },

  getDevices: () => [...mockDevices],

  getLatestReadings: () => ({
    temperature: lastTemp !== null ? { sensorId: 1, sensorName: "AHT20", type: "temperature", value: lastTemp, unit: "°C", timestamp: formatDateTime() } : undefined,
    humidity: lastHum !== null ? { sensorId: 2, sensorName: "AHT20", type: "humidity", value: lastHum, unit: "%", timestamp: formatDateTime() } : undefined,
    light: lastLight !== null ? { sensorId: 3, sensorName: "BH1750", type: "light", value: lastLight, unit: "lux", timestamp: formatDateTime() } : undefined,
  }),

  getSensorData: (params: { search?: string; time?: string; sensor?: string; type?: string; page?: number; limit?: number }) => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    let filtered = [...mockSensorHistory];

    // 1. Time Filter (String)
    const timeQuery = params.time || (params.search && /^\d{4}/.test(params.search.trim()) ? params.search : undefined);
    if (timeQuery && timeQuery.trim()) {
      const q = timeQuery.trim();
      const precisionMatch = parseSmartDatetime(q);

      if (precisionMatch) {
        filtered = filtered.filter((item) => {
          const itemDate = item.rawDate ? new Date(item.rawDate) : new Date(item.timestamp.replace(/\//g, "-"));
          return itemDate >= precisionMatch.startDate && itemDate <= precisionMatch.endDate;
        });
      } else {
        filtered = filtered.filter((item) => item.timestamp.toLowerCase().includes(q.toLowerCase()));
      }
    }

    // 2. Sensor / Type List Filter
    if (params.type && params.type !== "ALL") {
      filtered = filtered.filter((i) => i.type.toUpperCase() === params.type?.toUpperCase());
    }

    if (params.sensor && params.sensor !== "ALL") {
      filtered = filtered.filter((i) => i.sensorName.toUpperCase() === params.sensor?.toUpperCase());
    }

    // 3. Text Search (if not already handled)
    if (params.search && params.search.trim() && !timeQuery) {
      const q = params.search.trim();
      const numVal = parseFloat(q);
      if (!isNaN(numVal)) {
        filtered = filtered.filter((i) => Math.abs(i.value - numVal) < 0.1);
      } else {
        const lower = q.toLowerCase();
        filtered = filtered.filter((i) =>
          i.sensorName.toLowerCase().includes(lower) ||
          i.type.toLowerCase().includes(lower) ||
          i.id.toString() === q
        );
      }
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  getActionHistory: (params: { page?: number; limit?: number; search?: string; time?: string; device?: string; action?: string; status?: string }) => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    let filtered = [...mockActionHistory];

    // 1. Time Filter (String)
    const timeQuery = params.time || (params.search && /^\d{4}/.test(params.search.trim()) ? params.search : undefined);
    if (timeQuery && timeQuery.trim()) {
      const q = timeQuery.trim();
      filtered = filtered.filter((a) => a.activationTime.toLowerCase().includes(q.toLowerCase()));
    }

    // 2. Device Filter
    if (params.device && params.device !== "ALL") {
      filtered = filtered.filter((a) => a.deviceName.toUpperCase() === params.device?.toUpperCase());
    }

    // 3. Action Filter
    if (params.action && params.action !== "ALL") {
      filtered = filtered.filter((a) => a.action.toUpperCase() === params.action?.toUpperCase());
    }

    // 4. Status Filter
    if (params.status && params.status !== "ALL") {
      filtered = filtered.filter((a) => a.status.toUpperCase() === params.status?.toUpperCase());
    }

    // 5. Generic Search
    if (params.search && params.search.trim() && !timeQuery) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.deviceName.toLowerCase().includes(q) ||
          a.action.toLowerCase().includes(q) ||
          a.status.toLowerCase().includes(q) ||
          a.activationTime.includes(q) ||
          a.id.toString() === q
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  executeDeviceAction: (deviceId: number, action: "ON" | "OFF", simulateTimeout = false): Promise<ActionHistory> => {
    const dev = mockDevices.find((d) => d.id === deviceId);
    if (!dev) throw new Error("Device not found");

    const activationTime = new Date();
    const actionId = mockActionHistory.length + 1;

    // Set temporary LOADING
    dev.status = "LOADING";
    deviceListeners.forEach((fn) => fn({ ...dev }));

    const loadingRecord: ActionHistory = {
      id: actionId,
      deviceId: dev.id,
      deviceName: dev.name as "LED" | "FAN",
      action,
      status: "LOADING",
      activationTime: formatDateTime(activationTime),
      responseTime: "-",
      responseTimeMs: null,
      isDisconnect: false,
    };
    mockActionHistory.unshift(loadingRecord);
    actionListeners.forEach((fn) => fn(loadingRecord));

    const delayMs = simulateTimeout ? 7200 : Math.floor(1800 + Math.random() * 800);

    return new Promise((resolve) => {
      setTimeout(() => {
        const isTimeout = delayMs > 5000;
        const finalStatus = isTimeout ? "DISCONNECT" : action;
        const respSec = (delayMs / 1000).toFixed(1) + "s";

        dev.status = finalStatus;
        try {
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("devices", JSON.stringify(mockDevices));
          }
        } catch {}
        deviceListeners.forEach((fn) => fn({ ...dev }));

        const completedRecord: ActionHistory = {
          id: actionId,
          deviceId: dev.id,
          deviceName: dev.name as "LED" | "FAN",
          action,
          status: finalStatus,
          activationTime: formatDateTime(activationTime),
          responseTime: respSec,
          responseTimeMs: delayMs,
          isDisconnect: isTimeout,
        };

        const idx = mockActionHistory.findIndex((a) => a.id === actionId);
        if (idx >= 0) mockActionHistory[idx] = completedRecord;

        actionListeners.forEach((fn) => fn(completedRecord));
        resolve(completedRecord);
      }, Math.min(delayMs, 3200)); // UI resolves smoothly
    });
  },

  subscribeSensor: (fn: Listener) => {
    sensorListeners.add(fn);
    return () => sensorListeners.delete(fn);
  },
  subscribeDevice: (fn: Listener) => {
    deviceListeners.add(fn);
    return () => deviceListeners.delete(fn);
  },
  subscribeAction: (fn: Listener) => {
    actionListeners.add(fn);
    return () => actionListeners.delete(fn);
  },
  subscribeSimStatus: (fn: (isSimulating: boolean) => void) => {
    simStatusListeners.add(fn);
    return () => simStatusListeners.delete(fn);
  },

  isAutoSimulating: () => autoSimInterval !== null,

  generateSampleData: (count: number = 30) => {
    const now = new Date();
    const newSensorData: SensorData[] = [];
    const baseId = mockSensorHistory.length > 0 ? Math.max(...mockSensorHistory.map((s) => s.id)) + 1 : 1;

    let idCounter = baseId;
    for (let i = count; i >= 0; i--) {
      const recordedAt = new Date(now.getTime() - i * 90 * 1000); // 1.5 min apart
      const timeFormatted = formatDateTime(recordedAt);

      const tempVal = parseFloat((28.5 + Math.sin(i / 3) * 2.2 + (Math.random() * 0.6 - 0.3)).toFixed(1));
      const humVal = parseFloat((68.0 + Math.cos(i / 4) * 5.5 + (Math.random() * 1.2 - 0.6)).toFixed(1));
      const lightVal = parseFloat((550 + Math.sin(i / 2.5) * 180 + Math.floor(Math.random() * 30 - 15)).toFixed(0));

      newSensorData.unshift(
        {
          id: idCounter++,
          sensorId: 1,
          sensorName: "AHT20",
          type: "temperature",
          value: tempVal,
          unit: "°C",
          timestamp: timeFormatted,
          rawDate: recordedAt.toISOString(),
        },
        {
          id: idCounter++,
          sensorId: 2,
          sensorName: "AHT20",
          type: "humidity",
          value: humVal,
          unit: "%",
          timestamp: timeFormatted,
          rawDate: recordedAt.toISOString(),
        },
        {
          id: idCounter++,
          sensorId: 3,
          sensorName: "BH1750",
          type: "light",
          value: lightVal,
          unit: "lux",
          timestamp: timeFormatted,
          rawDate: recordedAt.toISOString(),
        }
      );
    }

    mockSensorHistory = [...newSensorData, ...mockSensorHistory].slice(0, 500);

    // Latest readings
    if (newSensorData.length >= 3) {
      lastTemp = newSensorData[0].value;
      lastHum = newSensorData[1].value;
      lastLight = newSensorData[2].value;

      sensorListeners.forEach((fn) => {
        fn(newSensorData[0]);
        fn(newSensorData[1]);
        fn(newSensorData[2]);
      });
    }

    // Generate sample Action History
    const baseActionId = mockActionHistory.length > 0 ? Math.max(...mockActionHistory.map((a) => a.id)) + 1 : 1;
    let actIdCounter = baseActionId;
    const sampleActions: ActionHistory[] = [
      {
        id: actIdCounter++,
        deviceId: 1,
        deviceName: "LED",
        action: "ON",
        status: "ON",
        activationTime: formatDateTime(new Date(now.getTime() - 40 * 60 * 1000)),
        responseTime: "2.3s",
        responseTimeMs: 2300,
        isDisconnect: false,
      },
      {
        id: actIdCounter++,
        deviceId: 2,
        deviceName: "FAN",
        action: "ON",
        status: "ON",
        activationTime: formatDateTime(new Date(now.getTime() - 25 * 60 * 1000)),
        responseTime: "1.9s",
        responseTimeMs: 1900,
        isDisconnect: false,
      },
      {
        id: actIdCounter++,
        deviceId: 2,
        deviceName: "FAN",
        action: "OFF",
        status: "OFF",
        activationTime: formatDateTime(new Date(now.getTime() - 15 * 60 * 1000)),
        responseTime: "2.1s",
        responseTimeMs: 2100,
        isDisconnect: false,
      },
      {
        id: actIdCounter++,
        deviceId: 1,
        deviceName: "LED",
        action: "OFF",
        status: "OFF",
        activationTime: formatDateTime(new Date(now.getTime() - 8 * 60 * 1000)),
        responseTime: "1.8s",
        responseTimeMs: 1800,
        isDisconnect: false,
      },
      {
        id: actIdCounter++,
        deviceId: 2,
        deviceName: "FAN",
        action: "ON",
        status: "DISCONNECT",
        activationTime: formatDateTime(new Date(now.getTime() - 3 * 60 * 1000)),
        responseTime: "7.2s",
        responseTimeMs: 7200,
        isDisconnect: true,
      },
      {
        id: actIdCounter++,
        deviceId: 1,
        deviceName: "LED",
        action: "ON",
        status: "ON",
        activationTime: formatDateTime(new Date(now.getTime() - 1 * 60 * 1000)),
        responseTime: "2.4s",
        responseTimeMs: 2400,
        isDisconnect: false,
      },
    ];

    mockActionHistory = [...sampleActions, ...mockActionHistory].slice(0, 200);
    saveMockData();

    return {
      sensorCount: newSensorData.length,
      actionCount: sampleActions.length,
    };
  },

  startAutoSimulation: (intervalMs: number = 3000) => {
    if (autoSimInterval) return;

    autoSimInterval = setInterval(() => {
      const now = new Date();
      const timeFormatted = formatDateTime(now);
      const nextId = mockSensorHistory.length > 0 ? Math.max(...mockSensorHistory.map((s) => s.id)) + 1 : 1;

      // Realistic random walks
      lastTemp = parseFloat(((lastTemp || 28.5) + (Math.random() * 0.8 - 0.4)).toFixed(1));
      if (lastTemp < 24) lastTemp = 24.5;
      if (lastTemp > 36) lastTemp = 35.5;

      lastHum = parseFloat(((lastHum || 68.0) + (Math.random() * 1.6 - 0.8)).toFixed(1));
      if (lastHum < 45) lastHum = 46.0;
      if (lastHum > 92) lastHum = 91.0;

      lastLight = parseFloat(((lastLight || 550) + Math.floor(Math.random() * 40 - 20)).toFixed(0));
      if (lastLight < 100) lastLight = 120;
      if (lastLight > 1200) lastLight = 1150;

      const tRecord: SensorData = {
        id: nextId,
        sensorId: 1,
        sensorName: "AHT20",
        type: "temperature",
        value: lastTemp,
        unit: "°C",
        timestamp: timeFormatted,
        rawDate: now.toISOString(),
      };

      const hRecord: SensorData = {
        id: nextId + 1,
        sensorId: 2,
        sensorName: "AHT20",
        type: "humidity",
        value: lastHum,
        unit: "%",
        timestamp: timeFormatted,
        rawDate: now.toISOString(),
      };

      const lRecord: SensorData = {
        id: nextId + 2,
        sensorId: 3,
        sensorName: "BH1750",
        type: "light",
        value: lastLight,
        unit: "lux",
        timestamp: timeFormatted,
        rawDate: now.toISOString(),
      };

      mockSensorHistory.unshift(tRecord, hRecord, lRecord);
      if (mockSensorHistory.length > 500) mockSensorHistory.pop();

      saveMockData();

      sensorListeners.forEach((fn) => {
        fn(tRecord);
        fn(hRecord);
        fn(lRecord);
      });
    }, intervalMs);

    simStatusListeners.forEach((fn) => fn(true));
  },

  stopAutoSimulation: () => {
    if (autoSimInterval) {
      clearInterval(autoSimInterval);
      autoSimInterval = null;
      simStatusListeners.forEach((fn) => fn(false));
    }
  },

  clearAllData: () => {
    mockSensorHistory = [];
    mockActionHistory = [];
    lastTemp = null;
    lastHum = null;
    lastLight = null;
    saveMockData();
    sensorListeners.forEach((fn) => fn({ type: "temperature", value: 0, clear: true }));
  },
};

