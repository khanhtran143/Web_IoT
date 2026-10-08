import React, { useState, useEffect } from "react";
import { Sparkles, Play, Square, Trash2, Zap, X, Database } from "lucide-react";
import { MockSimulator } from "../../services/mockSimulator";
import { useToast } from "../../context/ToastContext";

interface DataGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataGeneratorModal: React.FC<DataGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [isSimulating, setIsSimulating] = useState(() => MockSimulator.isAutoSimulating());
  const [stats, setStats] = useState({ sensors: 0, actions: 0 });
  const toast = useToast();

  const updateStats = () => {
    const sData = MockSimulator.getSensorData({ limit: 1 });
    const aData = MockSimulator.getActionHistory({ limit: 1 });
    setStats({
      sensors: sData.pagination.total,
      actions: aData.pagination.total,
    });
  };

  useEffect(() => {
    if (isOpen) {
      updateStats();
      setIsSimulating(MockSimulator.isAutoSimulating());
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = MockSimulator.subscribeSimStatus((status) => {
      setIsSimulating(status);
    });
    return () => {
      unsub();
    };
  }, []);

  if (!isOpen) return null;

  const handleGenerate = (count: number) => {
    const res = MockSimulator.generateSampleData(count);
    updateStats();
    toast.success(
      "Đã sinh dữ liệu mẫu thành công!",
      `Đã tạo +${res.sensorCount} bản ghi cảm biến & +${res.actionCount} nhật ký thao tác`
    );
  };

  const handleToggleAutoSim = () => {
    if (isSimulating) {
      MockSimulator.stopAutoSimulation();
      setIsSimulating(false);
      toast.info("Đã dừng tự động sinh dữ liệu", "Simulator tạm dừng phát sóng");
    } else {
      MockSimulator.startAutoSimulation(3000);
      setIsSimulating(true);
      toast.success("Đã bật tự động sinh dữ liệu", "Phát sóng telemetries mỗi 3 giây");
    }
  };

  const handleClear = () => {
    MockSimulator.clearAllData();
    updateStats();
    toast.warning("Đã xóa dữ liệu giả lập", "Toàn bộ lịch sử sensor & action đã đặt lại về trống");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Bộ sinh dữ liệu giả lập (Demo Simulator)</h3>
              <p className="text-xs text-emerald-100">Tạo dữ liệu cảm biến & nhật ký thiết bị phục vụ báo cáo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Indicator */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">Dữ liệu hiện tại:</span>
            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {stats.sensors} sensor records
            </span>
            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {stats.actions} actions
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulating ? "bg-emerald-500 animate-ping" : "bg-slate-300"
              }`}
            />
            <span className={isSimulating ? "text-emerald-600 font-bold" : "text-slate-400 font-medium"}>
              {isSimulating ? "Live Streaming" : "Idle"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* 1. Quick Batch Generation */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Sinh nhanh bản ghi lịch sử (Batch Generate)
            </label>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tạo hàng loạt dữ liệu lịch sử đo nhiệt độ (AHT20), độ ẩm (AHT20), ánh sáng (BH1750) và nhật ký bật/tắt thiết bị có mốc thời gian liên tục.
            </p>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {[30, 60, 100].map((count) => (
                <button
                  key={count}
                  onClick={() => handleGenerate(count)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 font-bold text-xs text-slate-700 transition flex flex-col items-center justify-center gap-1 shadow-2xs cursor-pointer group"
                >
                  <Zap className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>+{count} Mẫu</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Realtime Telemetry Simulation */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. Tự động phát dữ liệu trực tiếp (Live Stream 3s/lần)
            </label>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {isSimulating ? "Đang tự động phát tín hiệu ESP32" : "Chế độ phát tự động đang tắt"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mỗi 3 giây tự động tạo giá trị cảm biến mới để biểu đồ Dashboard chạy realtime
                </p>
              </div>

              <button
                onClick={handleToggleAutoSim}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer shrink-0 ml-3 ${
                  isSimulating
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {isSimulating ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Dừng phát</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Bật phát sóng</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Reset Option */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ dữ liệu mẫu</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
