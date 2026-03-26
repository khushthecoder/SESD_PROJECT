import React, { useEffect, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

const toastIcons: Record<ToastType, string> = {
  success: "✓", error: "✕", warning: "⚠", info: "ℹ",
};

const toastColors: Record<ToastType, string> = {
  success: "#27ae60", error: "#e74c3c", warning: "#f39c12", info: "#3498db",
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onRemove: (id: string) => void;
  duration: number;
}> = ({ toast, onRemove, duration }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove, duration]);

  return (
    <div className={`toast-item ${isExiting ? "toast-exit" : "toast-enter"}`}
      style={{ borderLeftColor: toastColors[toast.type] }}>
      <span className="toast-icon" style={{ color: toastColors[toast.type] }}>{toastIcons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>✕</button>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
  duration?: number;
}> = ({ toasts, onRemove, duration = 4000 }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} duration={duration} />
      ))}
    </div>
  );
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    toasts, removeToast,
    success: (msg: string) => addToast("success", msg),
    error: (msg: string) => addToast("error", msg),
    warning: (msg: string) => addToast("warning", msg),
    info: (msg: string) => addToast("info", msg),
  };
}
