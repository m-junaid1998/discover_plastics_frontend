import { toast as sonnerToast} from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

const config: Record<ToastType, { icon: any; border: string; color: string }> = {
  success: { icon: CheckCircle2, border: "border-emerald-500/30", color: "text-emerald-400" },
  error: { icon: AlertCircle, border: "border-red-500/30", color: "text-red-400" },
  info: { icon: Info, border: "border-blue-500/30", color: "text-blue-400" },
  warning: { icon: AlertTriangle, border: "border-amber-500/30", color: "text-amber-400" },
};

const showToast = (type: ToastType, msg: string, desc?: string) => {
  const { icon: Icon, border, color } = config[type];
  return sonnerToast.custom(
    (id) => (
      <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gray-900 border ${border} text-white shadow-2xl w-full max-w-md`}>
        <div className="flex items-center gap-2.5 min-w-0 text-xs truncate">
          <Icon className={`w-4 h-4 shrink-0 ${color}`} />
          <span className="font-bold text-gray-100 whitespace-nowrap">{msg}</span>
          {desc && <span className="text-gray-300 truncate">• {desc}</span>}
        </div>
        <button type="button" onClick={() => sonnerToast.dismiss(id)} className="p-1 text-gray-400 hover:text-white shrink-0 cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
    { duration: 1000 } 
  );
};

export const toast = {
  success: (m: string, d?: string) => showToast("success", m, d),
  error: (m: string, d?: string) => showToast("error", m, d),
  info: (m: string, d?: string) => showToast("info", m, d),
  warning: (m: string, d?: string) => showToast("warning", m, d),
  promise: sonnerToast.promise,
};