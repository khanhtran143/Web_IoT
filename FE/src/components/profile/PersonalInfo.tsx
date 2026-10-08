import React from "react";
import { Mail, Phone, GraduationCap, Award, CheckCircle2 } from "lucide-react";
import { UserProfile } from "../../types/user";

interface PersonalInfoProps {
  user: UserProfile | null;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between h-full overflow-y-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-slate-100">
        <div className="relative">
          <img
            src={user?.avatar || "/avatar.jpg"}
            alt="Student profile avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md shrink-0"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white" title="Online">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="min-w-0 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-between gap-2 flex-wrap">
            <h3 className="text-lg font-extrabold text-slate-900 truncate">
              {user?.full_name || "Trần Quốc Khánh"}
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Project Student
            </span>
          </div>
          <p className="text-sm font-bold text-emerald-600 font-mono mt-0.5">
            {user?.student_id || "B23DCAT150"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Posts and Telecommunications Institute of Technology (PTIT)
          </p>
        </div>
      </div>

      {/* Info Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
        {/* Lớp */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-700 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Class</p>
            <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{user?.class || "D23CQAT05-B"}</p>
          </div>
        </div>

        {/* Số điện thoại */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-700 shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Phone</p>
            <p className="font-bold text-slate-800 text-xs sm:text-sm font-mono truncate">0919 725 085</p>
          </div>
        </div>

        {/* Email */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-700 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email</p>
            <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{user?.email || "khanhtq143@gmail.com"}</p>
          </div>
        </div>

        {/* Học phần */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-700 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Course</p>
            <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">IoT và Ứng dụng</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="pt-3 text-xs text-slate-400 border-t border-slate-100 flex items-center justify-between">
        <span>IoT Project - Smart Monitoring & Control System</span>
        <span className="font-mono text-emerald-600 font-bold">PTIT 2026</span>
      </div>
    </div>
  );
};
