import React from "react";
import { Sidebar, NavPage } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPage,
  onNavigate,
  title,
  children,
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Fixed Left Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header title={title} />

        {/* Viewport-fitted Content Area (No vertical page scrolling for primary views) */}
        <main className="flex-1 min-h-0 overflow-hidden p-4 sm:p-5 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};
