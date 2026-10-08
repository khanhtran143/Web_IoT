import React, { useState } from "react";
import { Lightbulb, Fan, Loader2, Power } from "lucide-react";
import { Device } from "../../types/device";
import { deviceService } from "../../services/deviceService";
import { useToast } from "../../context/ToastContext";

interface DeviceControlProps {
  devices: Device[];
  onDeviceUpdated?: (dev: Device) => void;
}

export const DeviceControl: React.FC<DeviceControlProps> = ({ devices, onDeviceUpdated }) => {
  const [loadingDeviceId, setLoadingDeviceId] = useState<number | null>(null);
  const [simulateTimeout, setSimulateTimeout] = useState(false);
  const toast = useToast();

  const ledDevice = devices.find((d) => d.name === "LED") || {
    id: 1,
    name: "LED",
    type: "LIGHT",
    status: "ON",
  };

  const fanDevice = devices.find((d) => d.name === "FAN") || {
    id: 2,
    name: "FAN",
    type: "FAN",
    status: "OFF",
  };

  const handleToggle = async (device: Device) => {
    const nextStatus = device.status === "ON" ? "OFF" : "ON";
    setLoadingDeviceId(device.id);

    try {
      const updated = await deviceService.updateDeviceStatus(device.id, nextStatus, simulateTimeout);
      if (onDeviceUpdated) onDeviceUpdated(updated as any);
    } catch (err: any) {
      toast.error("Lỗi điều khiển thiết bị", err.message);
    } finally {
      setLoadingDeviceId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Device Control
          </h3>
        </div>

        {/* Demo Simulation Toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition" title="Mô phỏng timeout mất kết nối > 5s">
          <input
            type="checkbox"
            checked={simulateTimeout}
            onChange={(e) => setSimulateTimeout(e.target.checked)}
            className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <span className={simulateTimeout ? "text-amber-700 font-bold" : ""}>
            {simulateTimeout ? "⚠ Sim Timeout (>5s)" : "Normal Mode"}
          </span>
        </label>
      </div>

      {/* Device List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto py-2">
        {/* LED LIGHT CARD */}
        <div
          className={`relative p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            ledDevice.status === "ON"
              ? "bg-emerald-50/50 border-emerald-300 shadow-sm"
              : ledDevice.status === "DISCONNECT"
              ? "bg-red-50/50 border-red-300"
              : "bg-slate-50/70 border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  ledDevice.status === "ON"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-400/50 glow-green"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                <Lightbulb className={`w-5 h-5 ${ledDevice.status === "ON" ? "text-yellow-200 fill-yellow-200" : ""}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">LED Light</h4>
                <p className="text-[11px] text-slate-500">Living Room</p>
              </div>
            </div>

            {/* Status indicator */}
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                ledDevice.status === "ON"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : ledDevice.status === "DISCONNECT"
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-slate-200 text-slate-600 border-slate-300"
              }`}
            >
              {ledDevice.status}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="text-xs text-slate-500">State</span>
            <button
              onClick={() => handleToggle(ledDevice as Device)}
              disabled={loadingDeviceId === ledDevice.id}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-hidden disabled:opacity-50 ${
                ledDevice.status === "ON" ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                  ledDevice.status === "ON" ? "translate-x-8" : "translate-x-1"
                }`}
              >
                {loadingDeviceId === ledDevice.id ? (
                  <Loader2 className="w-3 h-3 text-slate-600 animate-spin" />
                ) : (
                  <Power className={`w-2.5 h-2.5 ${ledDevice.status === "ON" ? "text-emerald-600" : "text-slate-400"}`} />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* FAN CARD */}
        <div
          className={`relative p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            fanDevice.status === "ON"
              ? "bg-emerald-50/50 border-emerald-300 shadow-sm"
              : fanDevice.status === "DISCONNECT"
              ? "bg-red-50/50 border-red-300"
              : "bg-slate-50/70 border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  fanDevice.status === "ON"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-400/50"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                <Fan
                  className={`w-5 h-5 ${
                    fanDevice.status === "ON" ? "text-white animate-spin-slow" : ""
                  }`}
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Cooling Fan</h4>
                <p className="text-[11px] text-slate-500">Auto Exhaust</p>
              </div>
            </div>

            {/* Status indicator */}
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                fanDevice.status === "ON"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : fanDevice.status === "DISCONNECT"
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-slate-200 text-slate-600 border-slate-300"
              }`}
            >
              {fanDevice.status}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="text-xs text-slate-500">State</span>
            <button
              onClick={() => handleToggle(fanDevice as Device)}
              disabled={loadingDeviceId === fanDevice.id}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-hidden disabled:opacity-50 ${
                fanDevice.status === "ON" ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                  fanDevice.status === "ON" ? "translate-x-8" : "translate-x-1"
                }`}
              >
                {loadingDeviceId === fanDevice.id ? (
                  <Loader2 className="w-3 h-3 text-slate-600 animate-spin" />
                ) : (
                  <Power className={`w-2.5 h-2.5 ${fanDevice.status === "ON" ? "text-emerald-600" : "text-slate-400"}`} />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
        <span>Microcontroller: ESP32 NodeMCU</span>
        <span>Relay Driver: Active LOW</span>
      </div>
    </div>
  );
};
