import React from "react";
import { X, FileText, Download } from "lucide-react";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfPath: string;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  pdfPath,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{title}</h3>
              <p className="text-[11px] text-slate-500">{pdfPath}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfPath}
              download
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer Area */}
        <div className="flex-1 bg-slate-100 p-4 flex flex-col items-center justify-center">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 max-w-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">{title}</h4>
              <p className="text-xs text-slate-500 mt-1">
                Tài liệu thực hành IoT: Hệ thống cảm biến, thiết bị chấp hành, kết nối MQTT & WebSocket.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border text-xs text-slate-600 text-left space-y-1">
              <p className="font-semibold text-slate-800">Mục tiêu bài thực hành:</p>
              <p>• Cấu hình phần cứng ESP32 & chuẩn giao tiếp I2C</p>
              <p>• Lập trình đọc cảm biến AHT20 & BH1750</p>
              <p>• Điều khiển Relay đóng ngắt LED và FAN qua giao thức realtime</p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href={pdfPath}
                download
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Tải file PDF</span>
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
