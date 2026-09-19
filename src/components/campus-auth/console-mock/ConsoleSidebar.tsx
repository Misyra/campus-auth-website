import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, NAV_MAIN } from "./constants";

type Props = {
  compact: boolean;
  monitoring: boolean;
  onToast: (msg: string) => void;
};

export function ConsoleSidebar({ compact, monitoring, onToast }: Props) {

  return (
    <nav className={cn("flex shrink-0 flex-col border-r bg-muted/40", compact ? "w-10" : "w-[136px]")}>
      <div className={cn("flex items-center gap-2 border-b px-3", compact ? "h-9 justify-center py-2" : "h-11")}>
        <img src="/logo.png" alt="" className="h-6 w-6 rounded-md bg-white p-0.5 shadow-sm" />
        {!compact && <span className="text-[13px] font-bold">{APP_NAME}</span>}
      </div>

      <div className={cn("min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1.5", compact && "flex flex-col items-center")}>
        {NAV_MAIN.map((n) => {
          const Icon = n.icon;
          const active = n.key === "dashboard";
          return (
            <button
              key={n.key}
              onClick={() => n.key !== "dashboard" && onToast("演示版：仅实现仪表盘页面")}
              title={n.label}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition",
                compact && "justify-center px-0",
                active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!compact && <span>{n.label}</span>}
            </button>
          );
        })}

      </div>

      <div className="space-y-1.5 border-t p-1.5">
        <div
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md bg-emerald-500/10 py-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
            !monitoring && "bg-muted text-muted-foreground",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full bg-emerald-500", !monitoring && "bg-muted-foreground/50")} />
          {!compact && <span>{monitoring ? "运行中" : "已停止"}</span>}
        </div>
        <button
          onClick={() => onToast("演示模式：退出仅存在于真实应用")}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-red-500/30 py-1.5 text-[11px] text-red-500 transition hover:bg-red-500/10"
          title="退出应用"
        >
          <LogOut className="h-3.5 w-3.5" />
          {!compact && <span>退出</span>}
        </button>
      </div>
    </nav>
  );
}
