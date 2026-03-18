import type { CSSProperties } from "react";
import { toast } from "sonner";

type NotificationType = "success" | "error" | "info" | "warning";

const TOAST_DURATION_MS = 3500;

const TOAST_STYLES: Record<NotificationType, CSSProperties> = {
  success: {
    backgroundColor: "#16a34a",
    border: "1px solid #15803d",
    color: "#ffffff",
  },
  error: {
    backgroundColor: "#dc2626",
    border: "1px solid #b91c1c",
    color: "#ffffff",
  },
  info: {
    backgroundColor: "#2563eb",
    border: "1px solid #1d4ed8",
    color: "#ffffff",
  },
  warning: {
    backgroundColor: "#ea580c",
    border: "1px solid #c2410c",
    color: "#ffffff",
  },
};

function showNotification(type: NotificationType, message: string) {
  toast[type](message, {
    duration: TOAST_DURATION_MS,
    style: TOAST_STYLES[type],
  });
}

export const notify = {
  success: (message: string) => showNotification("success", message),
  error: (message: string) => showNotification("error", message),
  info: (message: string) => showNotification("info", message),
  warning: (message: string) => showNotification("warning", message),
};
