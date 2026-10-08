import React from "react";
import { ExternalLink, Github, Figma, Send, FileText } from "lucide-react";
import { UserProfile } from "../../types/user";

interface ProjectLinksProps {
  user: UserProfile | null;
}

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ user }) => {
  const links = [
    {
      id: "github",
      name: "GitHub Repository",
      desc: "Frontend, Backend Node.js & ESP32 Firmware source code",
      icon: <Github className="w-5 h-5 text-slate-900" />,
      url: user?.github_url || "https://github.com",
      bgHover: "hover:border-emerald-400",
    },
    {
      id: "figma",
      name: "Figma UI Design",
      desc: "Realtime Smart Home Dashboard UI/UX Design System",
      icon: <Figma className="w-5 h-5 text-purple-600" />,
      url: user?.figma_url || "https://www.figma.com/design/w9ja9VJ2rXH9RoI4eKTiGa/IoT?node-id=0-1&p=f&t=JodBVVmmPualFsZ4-0",
      bgHover: "hover:border-purple-400",
    },
    {
      id: "postman",
      name: "Postman API Documentation",
      desc: "REST API & WebSocket Telemetry testing collections",
      icon: <Send className="w-5 h-5 text-orange-500" />,
      url: user?.postman_url || "https://postman.com",
      bgHover: "hover:border-orange-400",
    },
    {
      id: "pdf_report",
      name: "Báo cáo BTL (PDF)",
      desc: "Báo cáo chi tiết đồ án IoT, sơ đồ mạch & kết quả thực nghiệm",
      icon: <FileText className="w-5 h-5 text-rose-500" />,
      url: user?.pdf_report_url || "https://drive.google.com",
      bgHover: "hover:border-rose-400",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between h-full overflow-y-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Project Resources & Links
          </h3>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {links.length} Links
        </span>
      </div>

      {/* Link List */}
      <div className="space-y-3 my-4">
        {links.map((link) => (
          <div
            key={link.id}
            className={`p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between transition-all duration-200 ${link.bgHover} hover:bg-white hover:shadow-xs`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs shrink-0">
                {link.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">{link.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{link.desc}</p>
              </div>
            </div>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs shrink-0 ml-3"
            >
              <span>Visit</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 text-xs text-slate-400 border-t border-slate-100 flex items-center justify-between">
        <span>External Links</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Active & Verified
        </span>
      </div>
    </div>
  );
};
