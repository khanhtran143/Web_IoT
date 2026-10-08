import React from "react";
import { SensorCard } from "../components/dashboard/SensorCard";
import { DeviceControl } from "../components/dashboard/DeviceControl";
import { RealtimeChart } from "../components/dashboard/RealtimeChart";
import { useSocket } from "../context/SocketContext";

export const DashboardPage: React.FC = () => {
  const { latestSensors, devices } = useSocket();

  const tempVal = latestSensors.temperature?.value;
  const humVal = latestSensors.humidity?.value;
  const lightVal = latestSensors.light?.value;

  return (
    <div className="flex flex-col h-full gap-3 sm:gap-4 overflow-hidden">
      {/* 1. Top Realtime Sensor Metric Cards (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 shrink-0">
        <SensorCard
          type="temperature"
          value={tempVal}
          unit="°C"
          isRealtime={true}
        />
        <SensorCard
          type="humidity"
          value={humVal}
          unit="%"
          isRealtime={true}
        />
        <SensorCard
          type="light"
          value={lightVal}
          unit="lux"
          isRealtime={true}
        />
      </div>

      {/* 2. Main Lower Section: Device Control (Left) + Realtime Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1 min-h-0">
        {/* Device Controls (5 Cols on large screen) */}
        <div className="lg:col-span-5 flex flex-col min-h-0 h-full">
          <DeviceControl devices={devices} />
        </div>

        {/* Realtime Line Chart (7 Cols on large screen) */}
        <div className="lg:col-span-7 flex flex-col min-h-0 h-full">
          <RealtimeChart />
        </div>
      </div>
    </div>
  );
};
