import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", "mb-10 md:mb-14", className)}>
      {eyebrow && <p className="mb-3 text-sm font-semibold tracking-widest text-primary">{eyebrow}</p>}
      <h2 className="text-display-md text-foreground">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>}
    </div>
  );
}
