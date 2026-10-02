import { Navigation2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RouteVisual({
  pickup,
  drop,
  progress,
  pickupMeta,
  dropMeta,
}: {
  pickup: string;
  drop: string;
  progress: number;
  pickupMeta?: string;
  dropMeta?: string;
}) {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <div className="relative flex gap-4">
      <div className="relative flex w-6 flex-col items-center pt-1.5">
        <span className="z-10 h-3.5 w-3.5 rounded-full border-2 border-mint bg-highway-900" />
        <div className="relative w-0.5 flex-1 overflow-hidden bg-muted">
          <div
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-mint to-primary transition-[height] duration-300 ease-linear"
            style={{ height: `${clamped * 100}%` }}
          />
        </div>
        <span className="z-10 h-3.5 w-3.5 rounded-full border-2 border-primary bg-highway-900" />
        {clamped > 0.02 && clamped < 1 && (
          <span
            className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full bg-primary p-1 text-primary-foreground shadow-glow transition-[top] duration-300 ease-linear"
            style={{ top: `calc(${clamped * 100}% - 10px)` }}
          >
            <Navigation2 className="h-3 w-3" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 py-0.5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Pickup
          </p>
          <p className={cn("truncate font-medium text-foreground")}>{pickup}</p>
          {pickupMeta && <p className="text-xs text-muted-foreground">{pickupMeta}</p>}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Drop
          </p>
          <p className="truncate font-medium text-foreground">{drop}</p>
          {dropMeta && <p className="text-xs text-muted-foreground">{dropMeta}</p>}
        </div>
      </div>
    </div>
  );
}
