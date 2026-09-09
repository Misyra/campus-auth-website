import { Check, Clock, RefreshCw, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_BTN } from "./constants";
import type { HistoryEntry } from "./types";

type Props = {
  history: HistoryEntry[];
  onToast: (msg: string) => void;
  onClear: () => void;
};

export function ConsoleHistoryPanel({ history, onToast, onClear }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-card">
      <div className="flex shrink-0 items-center justify-between border-b px-2.5 py-1.5">
        <span className="text-xs font-semibold">登录历史</span>
        <div className="flex items-center gap-1">
          <button className={cn(ICON_BTN, "h-6 w-6")} title="刷新" onClick={() => onToast("已刷新（演示）")}>
            <RefreshCw className="h-3 w-3" />
          </button>
          <button className={cn(ICON_BTN, "h-6 w-6")} title="清空" disabled={!history.length} onClick={onClear}>
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 p-2">
        {history.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <Clock className="h-5 w-5 opacity-40" />
            <span className="text-[11px]">暂无登录记录</span>
          </div>
        ) : (
          <div className="h-full space-y-1.5 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="rounded-md border px-2 py-1.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {h.ok ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-red-500" />}
                  <span className="font-medium">{h.time}</span>
                  <span className="ml-auto text-muted-foreground">{h.duration}</span>
                </div>
                <div className="mt-0.5 text-muted-foreground">
                  {h.profile} · {h.source}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
