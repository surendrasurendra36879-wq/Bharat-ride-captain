import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, Power, Radar, Star, TrendingUp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cityById } from "@/data/cities";
import { cn, formatINR } from "@/lib/utils";
import { OFFER_SECONDS, useCaptain } from "@/store/captain";

function CountdownRing({ seconds }: { seconds: number }) {
  const fraction = Math.max(0, Math.min(1, seconds / OFFER_SECONDS));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative grid h-16 w-16 place-items-center">
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="5" className="stroke-muted" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          stroke="currentColor"
          className={cn("text-primary", seconds < 5 && "text-destructive")}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <span
        className={cn(
          "font-display text-lg font-bold tabular",
          seconds < 5 ? "text-destructive" : "text-foreground",
        )}
      >
        {Math.ceil(seconds)}
      </span>
    </div>
  );
}

function OfferCard() {
  const { offer, secondsLeft, acceptOffer, declineOffer } = useCaptain();
  if (!offer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <Card className="overflow-hidden border-primary/40">
        <div className="h-1 w-full bg-gradient-to-r from-mint via-primary to-transparent" />
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="default">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                New ride request
              </Badge>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary/20 font-display font-bold text-mint-soft">
                  {offer.rider
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <p className="font-medium">{offer.rider}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    {offer.rating.toFixed(1)} · repeat rider
                  </p>
                </div>
              </div>
            </div>
            <CountdownRing seconds={secondsLeft} />
          </div>

          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-3">
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-mint" />
                  <span className="truncate">{offer.pickup}</span>
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{offer.drop}</span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-2xl font-bold tabular">{formatINR(offer.fare)}</p>
                {offer.surge > 1 && (
                  <p className="text-xs font-semibold text-mint">{offer.surge.toFixed(1)}× surge</p>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> {offer.distanceKm} km
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> ~{offer.durationMin} min
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="flex-1 bg-secondary text-white hover:bg-secondary/90" onClick={acceptOffer}>
              Accept ride
            </Button>
            <Button size="lg" variant="ghost" className="px-4" onClick={declineOffer} aria-label="Decline ride">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SearchingPanel() {
  const { data, goOffline } = useCaptain();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="map-grid overflow-hidden">
        <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
          <div className="relative grid h-28 w-28 place-items-center">
            <span className="absolute h-full w-full animate-pulse-ring rounded-full border-2 border-primary/50" />
            <span className="absolute h-3/4 w-3/4 animate-pulse-ring rounded-full border-2 border-primary/40 [animation-delay:0.6s]" />
            <span className="grid h-16 w-16 place-items-center rounded-full bg-highway-850 ring-1 ring-primary/60">
              <Radar className="h-7 w-7 text-primary" />
            </span>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Looking for rides near you</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {cityById(data.profile.city).name} demand · stay where you are, we'll ping you the
              moment a rider matches.
            </p>
          </div>
          <Badge variant="secondary">Pings usually arrive in under 10 seconds</Badge>
          <Button variant="outline" onClick={goOffline}>
            <Power className="h-4 w-4" /> Go offline
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OfflinePanel() {
  const { data, goOnline } = useCaptain();

  return (
    <Card className="map-grid overflow-hidden">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-2">
          <Badge variant="outline">You are offline</Badge>
          <h2 className="font-display text-2xl font-semibold">
            Ready when you are, {data.profile.name.split(" ")[0]}.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Go online to receive ride requests around {cityById(data.profile.city).name}.
            Today you've already earned{" "}
            <span className="font-semibold text-foreground">{formatINR(data.today.earnings)}</span>{" "}
            across {data.today.rides} rides.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={goOnline}>
            <Power className="h-5 w-5" /> Go online
          </Button>
          <span className="text-xs text-muted-foreground">
            You can pause anytime — no minimum hours.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatusPanel() {
  const { status } = useCaptain();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "offline" && <OfflinePanel key="offline" />}
      {status === "searching" && <SearchingPanel key="searching" />}
      {status === "incoming" && <OfferCard key="incoming" />}
    </AnimatePresence>
  );
}
