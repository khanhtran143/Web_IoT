import React, { useState, useEffect } from "react";
import { Clock, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { formatDateTime } from "../../utils/datetime";
import { DataGeneratorModal } from "../common/DataGeneratorModal";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const [timeStr, setTimeStr] = useState<string>(() => formatDateTime().split(" ")[1] || "08:30:00");
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const parts = formatDateTime().split(" ");
      if (parts[1]) setTimeStr(parts[1]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-end shadow-xs select-none shrink-0 z-10">
        {/* Right Actions & Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Data Generator Button */}
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            title="Mở bộ sinh dữ liệu giả lập để báo cáo"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Giả lập dữ liệu</span>
          </button>

          {/* Realtime Live Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Last updated:</span>
            <span className="font-bold text-slate-800 font-mono">{timeStr}</span>
          </div>

          {/* System Connected Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isConnected
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span>{isConnected ? "System Connected" : "Disconnected"}</span>
          </div>

          {/* User Avatar & Name */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={user?.avatar || "/avatar.jpg"}
              alt="User avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/30 shadow-xs"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.full_name || "Trần Quốc Khánh"}
              </p>
              <p className="text-[10px] font-medium text-emerald-600">
                {user?.student_id || "B23DCAT150"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Generator Modal */}
      <DataGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />
    </>
  );
};

