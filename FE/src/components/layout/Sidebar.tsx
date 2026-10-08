import React from "react";
import {
  LayoutDashboard,
  Cpu,
  History,
  User,
  Radio,
  LogOut,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

export type NavPage = "dashboard" | "sensors" | "action-history" | "profile";

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { logout, user } = useAuth();
  const { isConnected } = useSocket();

  const menuItems: { id: NavPage; label: string; icon: React.ReactNode }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "sensors",
      label: "Data Sensors",
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      id: "action-history",
      label: "Action History",
      icon: <History className="w-5 h-5" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-800 text-white flex flex-col h-full border-r border-emerald-500/40 shadow-lg select-none z-20 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-emerald-500/40 bg-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md text-white">
          <Radio className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold tracking-wider text-white uppercase drop-shadow-xs">
            SMART HOME
          </h1>
          <p className="text-[11px] font-semibold text-emerald-100 tracking-wide">
            IoT Monitoring & Control
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-emerald-200/90 uppercase tracking-wider">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-emerald-800 shadow-md shadow-emerald-950/20 font-bold translate-x-1"
                  : "text-emerald-50 hover:bg-white/15 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-emerald-600" : "text-emerald-200"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-4 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status & Logout */}
      <div className="p-4 border-t border-emerald-500/40 bg-black/10 space-y-3">
        {/* Realtime System Status Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isConnected ? (
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </div>
            ) : (
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
            )}
            <div>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
                System Status
              </p>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                {isConnected ? "Connected" : "Offline / Retry"}
              </p>
            </div>
          </div>
          {isConnected ? (
            <Wifi className="w-4 h-4 text-emerald-200" />
          ) : (
            <WifiOff className="w-4 h-4 text-rose-300" />
          )}
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatar || "/avatar.jpg"}
              alt="User"
              className="w-8 h-8 rounded-full object-cover border-2 border-white/40 shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user?.full_name || "Trần Quốc Khánh"}
              </p>
              <p className="text-[10px] font-medium text-emerald-200 truncate">
                {user?.student_id || "B23DCAT150"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/15 transition shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
