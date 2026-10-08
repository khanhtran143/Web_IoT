import React from "react";
import { ChevronLeft, ChevronRight, Cpu, Thermometer, Droplets, Sun } from "lucide-react";
import { SensorData } from "../../types/sensor";

interface SensorTableProps {
  data: SensorData[];
  loading?: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

export const SensorTable: React.FC<SensorTableProps> = ({
  data,
  loading = false,
  page,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const getSensorIcon = (type: string, _name?: string) => {
    if (type === "temperature") return <Thermometer className="w-3.5 h-3.5 text-emerald-600" />;
    if (type === "humidity") return <Droplets className="w-3.5 h-3.5 text-sky-600" />;
    if (type === "light") return <Sun className="w-3.5 h-3.5 text-amber-500" />;
    return <Cpu className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Table Container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-24">ID</th>
              <th className="py-3 px-4">Sensor Name</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-10"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-36"></div></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Cpu className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600">No sensor data found</p>
                    <p className="text-xs text-slate-400">Please try adjusting your search filters or timestamp.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-emerald-50/40 transition-colors duration-150"
                >
                  {/* ID */}
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-500 text-xs">
                    #{String(row.id).padStart(3, "0")}
                  </td>

                  {/* Sensor Name */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-slate-100 border border-slate-200">
                        {getSensorIcon(row.type, row.sensorName)}
                      </div>
                      <span className="font-bold text-slate-800">{row.sensorName}</span>
                    </div>
                  </td>

                  {/* Value */}
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono ${
                        row.type === "temperature"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : row.type === "humidity"
                          ? "bg-sky-50 text-sky-800 border border-sky-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {row.value} {row.unit}
                    </span>
                  </td>

                  {/* Time (yyyy/mm/dd hh:mm:ss) */}
                  <td className="py-2.5 px-4 font-mono text-xs text-slate-600 font-medium">
                    {row.timestamp}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <div>
          Showing <span className="font-bold text-slate-700">{data.length}</span> of{" "}
          <span className="font-bold text-slate-700">{totalItems}</span> records
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
