import React, { useState, useEffect, useCallback } from "react";
import { ActionSearch } from "../components/history/ActionSearch";
import { ActionTable } from "../components/history/ActionTable";
import { historyService } from "../services/historyService";
import { ActionHistory } from "../types/action";
import { useSocket } from "../context/SocketContext";

export const ActionHistoryPage: React.FC = () => {
  const [data, setData] = useState<ActionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeValue, setTimeValue] = useState("");
  const [deviceValue, setDeviceValue] = useState("ALL");
  const [actionValue, setActionValue] = useState("ALL");
  const [statusValue, setStatusValue] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { lastAction } = useSocket();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const device = deviceValue !== "ALL" ? deviceValue : undefined;
      const action = actionValue !== "ALL" ? actionValue : undefined;
      const status = statusValue !== "ALL" ? statusValue : undefined;

      const res = await historyService.getActions({
        search: timeValue,
        time: timeValue,
        device,
        action,
        status,
        page,
        limit: 10,
        sortBy: "activation_time",
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
  }, [timeValue, deviceValue, actionValue, statusValue, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData, lastAction]);

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleReset = () => {
    setTimeValue("");
    setDeviceValue("ALL");
    setActionValue("ALL");
    setStatusValue("ALL");
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full gap-3 sm:gap-4 overflow-hidden min-h-0">
      {/* Dual Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs shrink-0">
        <ActionSearch
          timeValue={timeValue}
          onTimeChange={setTimeValue}
          deviceValue={deviceValue}
          onDeviceChange={(val) => {
            setDeviceValue(val);
            setPage(1);
          }}
          actionValue={actionValue}
          onActionChange={(val) => {
            setActionValue(val);
            setPage(1);
          }}
          statusValue={statusValue}
          onStatusChange={(val) => {
            setStatusValue(val);
            setPage(1);
          }}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </div>

      {/* Action History 6-Column Table */}
      <div className="flex-1 min-h-0 flex flex-col">
        <ActionTable
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
