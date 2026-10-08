import React from "react";
import { PersonalInfo } from "../components/profile/PersonalInfo";
import { ProjectLinks } from "../components/profile/ProjectLinks";
import { useAuth } from "../context/AuthContext";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-full min-h-0 overflow-hidden">
      {/* Left Column: Personal Info (6 Cols) */}
      <div className="lg:col-span-6 flex flex-col min-h-0 h-full">
        <PersonalInfo user={user} />
      </div>

      {/* Right Column: Project Resources & Links (6 Cols) */}
      <div className="lg:col-span-6 flex flex-col min-h-0 h-full">
        <ProjectLinks user={user} />
      </div>
    </div>
  );
};
