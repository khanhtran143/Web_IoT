import React from "react";
import { Lightbulb, Fan, AlertTriangle, ChevronLeft, ChevronRight, History } from "lucide-react";
import { ActionHistory } from "../../types/action";
import { StatusBadge } from "./StatusBadge";

interface ActionTableProps {
  data: ActionHistory[];
  loading?: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

export const ActionTable: React.FC<ActionTableProps> = ({
  data,
  loading = false,
  page,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.toUpperCase().includes("LED")) {
      return (
        <div className="p-1 rounded-md bg-amber-50 border border-amber-200">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
        </div>
      );
    }
    return (
      <div className="p-1 rounded-md bg-sky-50 border border-sky-200">
        <Fan className="w-3.5 h-3.5 text-sky-600" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Table Container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-20">ID</th>
              <th className="py-3 px-4">Device</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Activation Time</th>
              <th className="py-3 px-4">Response Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-8"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-12"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <History className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600">No device action history found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isTimeout =
                  row.isDisconnect ||
                  row.status === "DISCONNECT" ||
                  (row.responseTimeMs !== null && row.responseTimeMs > 5000);

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors duration-150 ${
                      isTimeout
                        ? "bg-red-50/50 hover:bg-red-50"
                        : "hover:bg-emerald-50/40"
                    }`}
                  >
                    {/* ID */}
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-500 text-xs">
                      #{String(row.id).padStart(3, "0")}
                    </td>

                    {/* Device */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(row.deviceName)}
                        <span className="font-bold text-slate-800">
                          {row.deviceName}
                        </span>
                      </div>
                    </td>

                    {/* Action (ON / OFF) */}
                    <td className="py-2.5 px-4">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                          row.action === "ON"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {row.action}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-4">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Activation Time */}
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-600">
                      {row.activationTime}
                    </td>

                    {/* Response Time (Highlighted if > 5s Disconnect) */}
                    <td className="py-2.5 px-4">
                      {isTimeout ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 border border-red-300 text-red-800 font-bold text-xs animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          <span>{row.responseTime}</span>
                          <span className="text-[10px] bg-red-200 px-1 rounded">Disconnect</span>
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          {row.responseTime}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <div>
          Showing <span className="font-bold text-slate-700">{data.length}</span> of{" "}
          <span className="font-bold text-slate-700">{totalItems}</span> actions
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
