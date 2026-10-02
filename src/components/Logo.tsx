import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Logo({
  className,
  to = "/",
  showWordmark = true,
}: {
  className?: string;
  to?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link to={to} className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-highway-850 ring-1 ring-primary/50 transition-shadow group-hover:shadow-glow">
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
          <circle cx="32" cy="32" r="15" fill="none" stroke="#ff8a1f" strokeWidth="5" />
          <circle cx="32" cy="32" r="4" fill="#ff8a1f" />
          <path
            d="M32 10v8M32 46v8M10 32h8M46 32h8"
            stroke="#2fbf71"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          Bharat<span className="text-primary">Rides</span>
          <span className="ml-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Captain
          </span>
        </span>
      )}
    </Link>
  );
}
