import { LogOut, MapPin, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cityById } from "@/data/cities";
import { cn, initialsOf } from "@/lib/utils";
import { useCaptain } from "@/store/captain";
import { useAuth } from "@/store/auth";

export default function CaptainHeader() {
  const { status, data, goOnline, goOffline, tier } = useCaptain();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const online = status !== "offline";
  const onTrip = status === "trip";
  const city = cityById(data.profile.city);

  const handleToggle = () => {
    if (onTrip) return;
    if (online) goOffline();
    else goOnline();
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-highway-950/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Logo to="/captain" />
        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
          <MapPin className="h-3.5 w-3.5" /> {city.name}
        </span>
        <Badge variant={tier === "Silver" ? "outline" : "default"} className="hidden md:inline-flex">
          {tier} captain
        </Badge>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleToggle}
            disabled={onTrip}
            title={onTrip ? "Finish your current ride to go offline" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
              onTrip && "cursor-not-allowed opacity-70",
              online
                ? "border-mint/50 bg-mint/15 text-mint-soft hover:bg-mint/25"
                : "border-border bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="relative flex h-2.5 w-2.5">
              {online && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  online ? "bg-mint" : "bg-muted-foreground",
                )}
              />
            </span>
            {online ? (onTrip ? "On trip" : "Online") : "Offline"}
            {!onTrip && <Power className="h-3.5 w-3.5 opacity-70" />}
          </button>

          <div className="hidden items-center gap-2.5 border-l border-border pl-3 sm:flex">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
              {initialsOf(data.profile.name)}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{data.profile.name}</p>
              <p className="text-[11px] text-muted-foreground">{data.profile.vehicle}</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
