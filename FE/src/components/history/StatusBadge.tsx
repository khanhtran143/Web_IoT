import React from "react";
import { Loader2, AlertTriangle, Check, PowerOff } from "lucide-react";
import { ActionStatus } from "../../types/action";

interface StatusBadgeProps {
  status: ActionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "ON":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Check className="w-3 h-3 text-emerald-700" />
          ON
        </span>
      );
    case "OFF":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
          <PowerOff className="w-3 h-3 text-slate-500" />
          OFF
        </span>
      );
    case "LOADING":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin text-amber-700" />
          LOADING...
        </span>
      );
    case "DISCONNECT":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          DISCONNECT
        </span>
      );
  }
};
