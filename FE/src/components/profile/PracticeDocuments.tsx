import React, { useState } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { PdfPreviewModal } from "../common/PdfPreviewModal";

export const PracticeDocuments: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; path: string } | null>(null);

  const docs = [
    {
      id: "01",
      code: "Practice 01",
      name: "Bài thực hành 01 - Cấu hình ESP32 & Đọc cảm biến nhiệt độ/độ ẩm AHT20",
      path: "/documents/practice-01.pdf",
    },
    {
      id: "02",
      code: "Practice 02",
      name: "Bài thực hành 02 - Đo cường độ ánh sáng bằng cảm biến quang BH1750 I2C",
      path: "/documents/practice-02.pdf",
    },
    {
      id: "03",
      code: "Practice 03",
      name: "Bài thực hành 03 - Điều khiển Relay Actuator (LED & FAN) và Timeout Guard",
      path: "/documents/practice-03.pdf",
    },
    {
      id: "04",
      code: "Practice 04",
      name: "Bài thực hành 04 - Xây dựng Web Dashboard Realtime & Giao thức MQTT",
      path: "/documents/practice-04.pdf",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Practice Documents
          </h3>
          <p className="text-xs text-slate-500">4 Core laboratory reports & guidelines</p>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          4 Documents
        </span>
      </div>

      {/* Document List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto py-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-800 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  {doc.code}
                </span>
                <h4 className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2 mt-0.5">
                  {doc.name}
                </h4>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2.5 mt-2 border-t border-slate-200/60">
              <button
                onClick={() => setSelectedDoc({ title: `${doc.code} - ${doc.name}`, path: doc.path })}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition shadow-2xs"
              >
                <Eye className="w-3 h-3 text-slate-500" />
                <span>View</span>
              </button>

              <a
                href={doc.path}
                download
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition shadow-2xs"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
        <span>Format: Adobe PDF standard</span>
        <span className="text-slate-500 font-mono">/documents/*.pdf</span>
      </div>

      {/* Modal */}
      {selectedDoc && (
        <PdfPreviewModal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.title}
          pdfPath={selectedDoc.path}
        />
      )}
    </div>
  );
};
