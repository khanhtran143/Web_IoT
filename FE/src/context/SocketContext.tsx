import React, { createContext, useContext, useState, useEffect } from "react";
import { socketService } from "../services/socketService";
import { deviceService } from "../services/deviceService";
import { sensorService } from "../services/sensorService";
import { SensorData } from "../types/sensor";
import { Device } from "../types/device";
import { ActionHistory } from "../types/action";
import { useToast } from "./ToastContext";

interface SocketContextType {
  isConnected: boolean;
  latestSensors: {
    temperature?: SensorData;
    humidity?: SensorData;
    light?: SensorData;
  };
  devices: Device[];
  lastAction: ActionHistory | null;
  updateDevice: (dev: Device) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

function getInitialDevices(): Device[] {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("devices") : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    { id: 1, name: "LED", type: "LIGHT", status: "OFF", description: "Đèn LED Smart Living Room" },
    { id: 2, name: "FAN", type: "FAN", status: "OFF", description: "Quạt làm mát thông minh" },
  ];
}

function getInitialSensors() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("latest_sensors") : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [latestSensors, setLatestSensors] = useState<{
    temperature?: SensorData;
    humidity?: SensorData;
    light?: SensorData;
  }>(getInitialSensors);

  const [devices, setDevices] = useState<Device[]>(getInitialDevices);
  const [lastAction, setLastAction] = useState<ActionHistory | null>(null);
  const toast = useToast();

  const updateDevice = (dev: Device) => {
    setDevices((prev) => {
      const idx = prev.findIndex((d) => d.id === dev.id);
      let updated: Device[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = { ...updated[idx], ...dev };
      } else {
        updated = [...prev, dev];
      }
      try {
        localStorage.setItem("devices", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  useEffect(() => {
    // 1. Fetch latest real persisted sensor readings from backend API
    sensorService.getLatestReadings().then((readings) => {
      if (readings && Object.keys(readings).length > 0) {
        setLatestSensors(readings);
        try {
          localStorage.setItem("latest_sensors", JSON.stringify(readings));
        } catch {}
      }
    }).catch(() => {});

    // 2. Fetch latest persisted device states from backend API
    deviceService.getDevices().then((devs) => {
      if (devs && devs.length > 0) {
        setDevices(devs);
        try {
          localStorage.setItem("devices", JSON.stringify(devs));
        } catch {}
      }
    }).catch(() => {});

    socketService.connect((status) => setIsConnected(status));

    const unsubSensor = socketService.onSensorUpdate((data: SensorData) => {
      setLatestSensors((prev) => {
        const typeKey = data.type.toLowerCase() as "temperature" | "humidity" | "light";
        const next = {
          ...prev,
          [typeKey]: data,
        };
        try {
          localStorage.setItem("latest_sensors", JSON.stringify(next));
        } catch {}
        return next;
      });
    });

    const unsubDevice = socketService.onDeviceUpdate((dev: Device) => {
      updateDevice(dev);
    });

    const unsubAction = socketService.onActionUpdate((act: ActionHistory) => {
      setLastAction(act);

      if (act.status === "ON") {
        toast.success(`✓ ${act.deviceName} switched ON`, `Response time: ${act.responseTime || "2.4s"}`);
      } else if (act.status === "OFF") {
        toast.info(`✓ ${act.deviceName} switched OFF`, `Response time: ${act.responseTime || "1.9s"}`);
      } else if (act.status === "DISCONNECT") {
        toast.error(`⚠ Device ${act.deviceName} disconnected (Timeout > 5s)`, `No response received from device`);
      }
    });

    return () => {
      unsubSensor();
      unsubDevice();
      unsubAction();
      socketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, latestSensors, devices, lastAction, updateDevice }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
