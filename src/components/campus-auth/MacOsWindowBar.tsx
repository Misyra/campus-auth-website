import { cn } from "@/lib/utils";

export function MacOsWindowBar({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-1.5">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
      </div>
      {children}
    </div>
  );
}
