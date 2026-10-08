import React, { useState } from "react";
import {
  Radio,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("khanhtq143@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login Successful", "Welcome back to Smart Home IoT Dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid email or password");
      toast.error("Login Failed", err.message || "Please verify your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 select-none">
      {/* Left Visual Column - IoT Hero */}
      <div className="relative md:w-1/2 h-48 md:h-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 md:p-12 flex flex-col justify-between overflow-hidden text-white shadow-xl">
        {/* Glow backdrop luminous blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-wider uppercase drop-shadow-xs">
              SMART HOME IOT
            </h1>
            <p className="text-xs text-emerald-100 font-medium">
              Intelligent Monitoring & Control System
            </p>
          </div>
        </div>

        {/* Middle Hero Visual Box (Hidden on small mobile) */}
        <div className="hidden md:flex flex-col gap-5 relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold w-fit shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
            Realtime Telemetry & Actuator Control
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
            Next-Gen Smart Home <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-teal-100 to-white font-black">
              Sensor & Device Dashboard
            </span>
          </h2>

          {/* Quick Metrics Badge Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
            <div className="bg-white/15 backdrop-blur-md border border-white/25 p-3 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-100">Sensors</span>
              <p className="text-base font-extrabold text-white font-mono">AHT20 / BH1750</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/25 p-3 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-100">Devices</span>
              <p className="text-base font-extrabold text-white font-mono">LED & FAN</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/25 p-3 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-100">Protocols</span>
              <p className="text-base font-extrabold text-white font-mono">WS / REST / MQTT</p>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="relative z-10 hidden md:flex items-center justify-between text-xs text-emerald-100/90 pt-4 border-t border-white/20">
          <span>IoT Project - 2026</span>
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-200" /> Secure JWT Authentication
          </span>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 h-full bg-white flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              System Login
            </h2>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khanhtq143@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
