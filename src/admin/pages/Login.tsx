import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";

export default function Login() {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("password");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.login(user, pass);
      nav("/admin");
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      className="min-h-screen bg-[#07192E] flex items-center justify-center p-4"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-[20px] shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B2545] to-[#0D9488] p-6 text-white text-center">
            <img
              src="/assets/logo/mbp-logo-bg-removed.png"
              alt="MBP Education logo"
              className="w-12 h-12 mx-auto bg-white rounded-full p-1 object-contain"
            />
            <div
              className="mt-3 font-bold text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Milne Bay Education
            </div>
            <div className="text-teal-100 text-xs font-bold uppercase tracking-widest">
              Admin Sign In
            </div>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4" aria-busy={loading}>
            {err && (
              <div
                id="login-error"
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl"
              >
                {err}
              </div>
            )}
            <div>
              <label htmlFor="login-username" className="text-sm font-semibold text-gray-700">
                Username or Email
              </label>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                aria-invalid={!!err || undefined}
                aria-describedby={err ? "login-error" : undefined}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                placeholder="admin"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!err || undefined}
                aria-describedby={err ? "login-password-hint login-error" : "login-password-hint"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                placeholder="••••••••"
              />
              <div id="login-password-hint" className="text-xs text-gray-500 mt-1.5">
                Default: <span className="font-mono font-bold">admin / password</span> (change after
                first login)
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-[#0B2545] hover:bg-[#0D9488] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
            <div className="text-center text-xs text-gray-500">
              Backend:{" "}
              <span className="font-mono">
                {(import.meta as any).env?.VITE_API_BASE || "http://localhost/mbp-api"}
              </span>{" "}
              - falls back to local mock if XAMPP offline.
              <br />
              <Link to="/" className="text-[#0D9488] font-semibold hover:underline">
                ← Back to site
              </Link>
            </div>
          </form>
        </div>
        <div className="text-center text-white/50 text-xs mt-4">
          XAMPP → start Apache + MySQL → import backend/database/mbp_education.sql
        </div>
      </div>
    </div>
  );
}
