import React, { useState, useEffect, useCallback } from "react";
import { SensorSearch } from "../components/sensors/SensorSearch";
import { SensorTable } from "../components/sensors/SensorTable";
import { sensorService } from "../services/sensorService";
import { SensorData } from "../types/sensor";

export const SensorsPage: React.FC = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeValue, setTimeValue] = useState("");
  const [typeValue, setTypeValue] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sensorService.getSensorData({
        search: timeValue,
        type: typeValue !== "ALL" ? typeValue : undefined,
        page,
        limit: 10,
        sortBy: "recorded_at",
        sortOrder: "desc",
      });
      setData(res.items);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.total);
      }
    } catch (e) {
      // error handled
    } finally {
      setLoading(false);
    }
  }, [timeValue, typeValue, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchSubmit = () => {
    setPage(1);
    fetchData();
  };

  const handleReset = () => {
    setTimeValue("");
    setTypeValue("ALL");
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full gap-3 sm:gap-4 overflow-hidden min-h-0">
      {/* Top Dual Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs shrink-0">
        <SensorSearch
          timeValue={timeValue}
          onTimeChange={setTimeValue}
          typeValue={typeValue}
          onTypeChange={(val) => {
            setTypeValue(val);
            setPage(1);
          }}
          onSearch={handleSearchSubmit}
          onReset={handleReset}
        />
      </div>

      {/* 4-Column Sensor History Table with pagination */}
      <div className="flex-1 min-h-0 flex flex-col">
        <SensorTable
          data={data}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
