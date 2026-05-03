import { AlertCircle, CheckCircle2, Info, TriangleAlert, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "info" | "warning" | "danger" | "success" | "tip" | "note";

interface AlertBoxProps {
  type?: AlertType;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const palette: Record<AlertType, { ring: string; glow: string; icon: string; tint: string }> = {
  info:    { ring: "border-sky-500/30",    glow: "shadow-sky-500/10",    icon: "text-sky-400",    tint: "from-sky-500/10 to-sky-500/0" },
  tip:     { ring: "border-cyan-500/30",   glow: "shadow-cyan-500/10",   icon: "text-cyan-400",   tint: "from-cyan-500/10 to-cyan-500/0" },
  note:    { ring: "border-violet-500/30", glow: "shadow-violet-500/10", icon: "text-violet-400", tint: "from-violet-500/10 to-violet-500/0" },
  warning: { ring: "border-amber-500/30",  glow: "shadow-amber-500/10",  icon: "text-amber-400",  tint: "from-amber-500/10 to-amber-500/0" },
  danger:  { ring: "border-rose-500/30",   glow: "shadow-rose-500/10",   icon: "text-rose-400",   tint: "from-rose-500/10 to-rose-500/0" },
  success: { ring: "border-emerald-500/30",glow: "shadow-emerald-500/10",icon: "text-emerald-400",tint: "from-emerald-500/10 to-emerald-500/0" },
};

const icons = {
  info: Info,
  tip: Lightbulb,
  note: Info,
  warning: TriangleAlert,
  danger: AlertCircle,
  success: CheckCircle2,
};

export function AlertBox({ type = "info", title, children, className }: AlertBoxProps) {
  const Icon = icons[type];
  const p = palette[type];

  return (
    <div
      className={cn(
        "relative my-6 rounded-xl border bg-gradient-to-br shadow-lg p-5 flex gap-4 items-start overflow-hidden",
        p.ring,
        p.glow,
        p.tint,
        className
      )}
    >
      <div
        className={cn(
          "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-background/40 border",
          p.ring,
        )}
      >
        <Icon className={cn("w-5 h-5", p.icon)} />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className={cn("font-semibold mb-1.5 mt-0 pb-0 border-0 text-foreground")}>{title}</h5>
        <div className="text-sm leading-relaxed text-foreground/80 [&>p]:mb-2 [&>p:last-child]:mb-0 [&_code]:text-[0.85em]">
          {children}
        </div>
      </div>
    </div>
  );
}
