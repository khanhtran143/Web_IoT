import React, { useState, useEffect } from "react";
import { Calendar, Cpu, Zap, Activity, X, Sparkles, Search, RotateCcw } from "lucide-react";
import { parseSmartDatetime, PrecisionMatch } from "../../utils/datetime";

interface ActionSearchProps {
  timeValue: string;
  onTimeChange: (val: string) => void;
  deviceValue: string;
  onDeviceChange: (val: string) => void;
  actionValue: string;
  onActionChange: (val: string) => void;
  statusValue: string;
  onStatusChange: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const ActionSearch: React.FC<ActionSearchProps> = ({
  timeValue,
  onTimeChange,
  deviceValue,
  onDeviceChange,
  actionValue,
  onActionChange,
  statusValue,
  onStatusChange,
  onSearch,
  onReset,
}) => {
  const [precisionInfo, setPrecisionInfo] = useState<PrecisionMatch | null>(null);

  useEffect(() => {
    if (timeValue.trim()) {
      setPrecisionInfo(parseSmartDatetime(timeValue));
    } else {
      setPrecisionInfo(null);
    }
  }, [timeValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const hasFilter =
    !!timeValue.trim() ||
    deviceValue !== "ALL" ||
    actionValue !== "ALL" ||
    statusValue !== "ALL";

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* 1. Time Search Input (String) */}
        <div className="relative flex-1">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={timeValue}
            onChange={(e) => onTimeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by activation time..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
          {timeValue && (
            <button
              onClick={() => onTimeChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              title="Clear time"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Device Dropdown */}
        <div className="relative md:w-36 lg:w-40">
          <Cpu className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={deviceValue}
            onChange={(e) => onDeviceChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer appearance-none"
          >
            <option value="ALL">All Devices</option>
            <option value="LED">LED</option>
            <option value="FAN">FAN</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 3. Action Dropdown */}
        <div className="relative md:w-36 lg:w-40">
          <Zap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={actionValue}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer appearance-none"
          >
            <option value="ALL">All Actions</option>
            <option value="ON">ON</option>
            <option value="OFF">OFF</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 4. Status Dropdown */}
        <div className="relative md:w-36 lg:w-40">
          <Activity className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={statusValue}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer appearance-none"
          >
            <option value="ALL">All Status</option>
            <option value="ON">ON</option>
            <option value="OFF">OFF</option>
            <option value="DISCONNECT">DISCONNECT</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 5. Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSearch}
            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          {hasFilter && (
            <button
              onClick={onReset}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 rounded-xl transition cursor-pointer"
              title="Reset filter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Smart Datetime Precision Badge */}
      {precisionInfo && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium w-fit animate-in fade-in duration-150">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{precisionInfo.description}</span>
        </div>
      )}
    </div>
  );
};
