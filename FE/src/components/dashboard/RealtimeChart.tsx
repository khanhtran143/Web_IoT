import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useSocket } from "../../context/SocketContext";

interface ChartPoint {
  time: string;
  temperature: number;
  humidity: number;
  light: number;
}

export const RealtimeChart: React.FC = () => {
  const { latestSensors } = useSocket();
  const [dataPoints, setDataPoints] = useState<ChartPoint[]>(() => {
    try {
      const cached = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("chart_points") : null;
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [activeMetric, setActiveMetric] = useState<"ALL" | "TEMP" | "HUM" | "LIGHT">(() => {
    try {
      const saved = typeof localStorage !== "undefined" ? localStorage.getItem("chart_metric") : null;
      if (saved && ["ALL", "TEMP", "HUM", "LIGHT"].includes(saved)) {
        return saved as any;
      }
    } catch {}
    return "ALL";
  });

  const handleMetricChange = (metric: "ALL" | "TEMP" | "HUM" | "LIGHT") => {
    setActiveMetric(metric);
    try {
      localStorage.setItem("chart_metric", metric);
    } catch {}
  };

  useEffect(() => {
    const hasTemp = latestSensors.temperature?.value !== undefined && latestSensors.temperature?.value !== null;
    const hasHum = latestSensors.humidity?.value !== undefined && latestSensors.humidity?.value !== null;
    const hasLight = latestSensors.light?.value !== undefined && latestSensors.light?.value !== null;

    if (!hasTemp && !hasHum && !hasLight) return;

    const timeStr = new Date().toTimeString().split(" ")[0];
    const newPoint: ChartPoint = {
      time: timeStr,
      temperature: hasTemp ? Number(latestSensors.temperature!.value.toFixed(1)) : 0,
      humidity: hasHum ? Math.round(latestSensors.humidity!.value) : 0,
      light: hasLight ? Math.round(latestSensors.light!.value) : 0,
    };

    setDataPoints((prev) => {
      let updated = [...prev, newPoint];
      if (updated.length > 30) {
        updated = updated.slice(updated.length - 30);
      }
      try {
        sessionStorage.setItem("chart_points", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [latestSensors]);

  const getDomain = (): [number, number] => {
    if (activeMetric === "TEMP") return [0, 50];
    if (activeMetric === "HUM") return [0, 100];
    if (activeMetric === "LIGHT") return [0, 1000];
    return [0, 100];
  };

  const currentDomain = getDomain();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between h-full min-h-0">
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Realtime Sensor Telemetry
          </h3>
        </div>

        {/* Filter Metric Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => handleMetricChange("ALL")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeMetric === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleMetricChange("TEMP")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeMetric === "TEMP"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            Temp
          </button>
          <button
            onClick={() => handleMetricChange("HUM")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeMetric === "HUM"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-sky-700 hover:bg-sky-50"
            }`}
          >
            Hum
          </button>
          <button
            onClick={() => handleMetricChange("LIGHT")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeMetric === "LIGHT"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            Light
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="flex-1 w-full min-h-0 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataPoints}
            margin={{
              top: 10,
              right: activeMetric === "ALL" ? 15 : 45,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            {/* Left Y-axis: Luôn hiển thị cho cả ALL và từng loại */}
            <YAxis
              yAxisId="left"
              domain={currentDomain}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => `${v}`}
            />
            {/* Right Y-axis: Hiển thị giá trị & đơn vị cho từng loại riêng, ẩn khi ở ALL */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={currentDomain}
              stroke={
                activeMetric === "TEMP"
                  ? "#4ea882"
                  : activeMetric === "HUM"
                  ? "#0284c7"
                  : "#d97706"
              }
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => {
                if (activeMetric === "TEMP") return `${v} °C`;
                if (activeMetric === "HUM") return `${v} %`;
                if (activeMetric === "LIGHT") return `${v} lx`;
                return `${v}`;
              }}
              hide={activeMetric === "ALL"}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                fontSize: "12px",
              }}
              formatter={(value: any, name: string) => {
                if (name === "Temperature") return [`${Number(value).toFixed(1)} °C`, name];
                if (name === "Humidity") return [`${Number(value).toFixed(1)} %`, name];
                if (name === "Light") return [`${value} lux`, name];
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }}
              iconType="circle"
              iconSize={8}
            />

            {(activeMetric === "ALL" || activeMetric === "TEMP") && (
              <Line
                yAxisId={activeMetric === "ALL" ? "left" : "right"}
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#4ea882"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#4ea882" }}
                isAnimationActive={false}
              />
            )}

            {(activeMetric === "ALL" || activeMetric === "HUM") && (
              <Line
                yAxisId={activeMetric === "ALL" ? "left" : "right"}
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#0284c7" }}
                isAnimationActive={false}
              />
            )}

            {(activeMetric === "ALL" || activeMetric === "LIGHT") && (
              <Line
                yAxisId={activeMetric === "ALL" ? "left" : "right"}
                type="monotone"
                dataKey="light"
                name="Light"
                stroke="#d97706"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#d97706" }}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
