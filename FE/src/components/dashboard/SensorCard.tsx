import React from "react";
import { Thermometer, Droplets, Sun } from "lucide-react";

export type SensorType = "temperature" | "humidity" | "light";

interface SensorCardProps {
  type: SensorType;
  value?: number | null;
  unit: string;
  isRealtime?: boolean;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  type,
  value,
  unit,
  isRealtime = true,
}) => {
  const hasValue = value !== undefined && value !== null && !isNaN(value);

  const getMeta = () => {
    switch (type) {
      case "temperature":
        return {
          title: "Temperature",
          icon: <Thermometer className="w-6 h-6 text-emerald-600" />,
          bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-200",
          gradient: "from-emerald-500/10 to-transparent",
          badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
          formattedValue: hasValue ? `${value!.toFixed(1)} ${unit}` : `-- ${unit}`,
          sensorModel: "AHT20 (I2C)",
        };
      case "humidity":
        return {
          title: "Humidity",
          icon: <Droplets className="w-6 h-6 text-sky-600" />,
          bgIcon: "bg-sky-50 text-sky-600 border-sky-200",
          gradient: "from-sky-500/10 to-transparent",
          badgeColor: "text-sky-700 bg-sky-50 border-sky-200",
          formattedValue: hasValue ? `${Math.round(value!)} ${unit}` : `-- ${unit}`,
          sensorModel: "AHT20 (I2C)",
        };
      case "light":
        return {
          title: "Light Intensity",
          icon: <Sun className="w-6 h-6 text-amber-500" />,
          bgIcon: "bg-amber-50 text-amber-600 border-amber-200",
          gradient: "from-amber-500/10 to-transparent",
          badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
          formattedValue: hasValue ? `${Math.round(value!)} ${unit}` : `-- ${unit}`,
          sensorModel: "BH1750 (I2C)",
        };
    }
  };

  const meta = getMeta();

  return (
    <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Subtle top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${type === "light" ? "from-amber-400 to-amber-500" : type === "humidity" ? "from-sky-400 to-sky-500" : "from-emerald-500 to-emerald-600"}`} />

      {/* Header with Title and Icon */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {meta.title}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isRealtime && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Realtime
              </span>
            )}
          </div>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs ${meta.bgIcon}`}>
          {meta.icon}
        </div>
      </div>

      {/* Large Value Display */}
      <div className="my-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
          {meta.formattedValue}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] text-slate-400 font-medium">
          Sensor: {meta.sensorModel}
        </span>
        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Live
        </span>
      </div>
    </div>
  );
};
