import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { SocketProvider } from "./context/SocketContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { SensorsPage } from "./pages/SensorsPage";
import { ActionHistoryPage } from "./pages/ActionHistoryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NavPage } from "./components/layout/Sidebar";

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<NavPage>("dashboard");

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const getPageInfo = () => {
    switch (currentPage) {
      case "dashboard":
        return {
          title: "Dashboard Overview",
        };
      case "sensors":
        return {
          title: "Data Sensors History",
        };
      case "action-history":
        return {
          title: "Device Action History",
        };
      case "profile":
        return {
          title: "User Profile & Resources",
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      title={pageInfo.title}
    >
      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "sensors" && <SensorsPage />}
      {currentPage === "action-history" && <ActionHistoryPage />}
      {currentPage === "profile" && <ProfilePage />}
    </DashboardLayout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <MainApp />
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
