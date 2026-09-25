import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};
type Ctx = {
  show: (msg: string, type?: Toast["type"]) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const c = useContext(ToastCtx);
  if (!c) throw new Error("useToast outside provider");
  return c;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);
  const success = (m: string) => show(m, "success");
  const error = (m: string) => show(m, "error");
  return (
    <ToastCtx.Provider value={{ show, success, error }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto min-w-[280px] max-w-[360px] rounded-xl shadow-xl border px-4 py-3 flex items-start gap-3 backdrop-blur bg-white ${
              t.type === "success"
                ? "border-emerald-200"
                : t.type === "error"
                  ? "border-red-200"
                  : "border-gray-200"
            }`}
          >
            <span
              className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${
                t.type === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : t.type === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {t.type === "success" ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : t.type === "error" ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <div
                className={`text-sm font-bold ${
                  t.type === "success"
                    ? "text-emerald-800"
                    : t.type === "error"
                      ? "text-red-800"
                      : "text-gray-800"
                }`}
              >
                {t.type === "success" ? "Success" : t.type === "error" ? "Error" : "Info"}
              </div>
              <div className="text-sm text-gray-700 leading-snug">{t.message}</div>
            </div>
            <button
              onClick={() => setToasts((items) => items.filter((item) => item.id !== t.id))}
              className="text-gray-400 hover:text-gray-700 pointer-events-auto"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
