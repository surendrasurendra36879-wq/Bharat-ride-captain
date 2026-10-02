import { motion } from "framer-motion";
import { CheckCircle2, Clock, MessageSquare, Phone, ShieldCheck, Siren, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { useCaptain, type Leg } from "@/store/captain";
import RouteVisual from "@/components/captain/RouteVisual";

const STEPS: { key: Leg; label: string }[] = [
  { key: "pickup", label: "At pickup" },
  { key: "onroute", label: "On trip" },
  { key: "arrived", label: "Complete" },
];

export default function ActiveTripCard() {
  const { trip, leg, overallProgress, completeTrip } = useCaptain();
  if (!trip) return null;

  const stepIndex = STEPS.findIndex((step) => step.key === leg);
  const etaMinutes =
    leg === "pickup"
      ? 4
      : leg === "onroute"
        ? Math.max(1, Math.round(trip.durationMin * (1 - (overallProgress - 0.35) / 0.65)))
        : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary to-mint" />
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint-soft" />
              {leg === "arrived" ? "Trip complete" : "On trip"}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {trip.rating.toFixed(1)} · {trip.rider}
            </div>
          </div>

          <ol className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <li key={step.key} className="flex flex-1 items-center gap-2">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors ${
                    index <= stepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < stepIndex ? "✓" : index + 1}
                </span>
                <span
                  className={`text-xs font-medium ${index <= stepIndex ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.label}
                </span>
                {index < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" />}
              </li>
            ))}
          </ol>

          <div className="rounded-xl border border-border bg-background/40 p-4">
            <RouteVisual
              pickup={trip.pickup}
              drop={trip.drop}
              progress={overallProgress}
              pickupMeta={
                leg === "pickup"
                  ? `You · ${etaMinutes} min away`
                  : leg === "arrived"
                    ? "Rider dropped"
                    : "Rider on board"
              }
              dropMeta={`${trip.distanceKm} km · ~${trip.durationMin} min`}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {leg === "arrived"
                  ? "Arrived at destination"
                  : leg === "pickup"
                    ? `${etaMinutes} min to pickup`
                    : `${etaMinutes} min to drop`}
              </span>
              <span className="tabular">{Math.round(overallProgress * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mint to-primary transition-[width] duration-300 ease-linear"
                style={{ width: `${overallProgress * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Fare</p>
              <p className="font-display text-2xl font-bold tabular">{formatINR(trip.fare)}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Cashless · UPI</Badge>
              {trip.surge > 1 && <Badge variant="secondary">{trip.surge.toFixed(1)}× surge</Badge>}
            </div>
          </div>

          {leg === "arrived" ? (
            <Button size="lg" className="w-full" onClick={completeTrip}>
              <CheckCircle2 className="h-5 w-5" /> Complete ride · collect {formatINR(trip.fare)}
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Phone className="h-4 w-4" /> Call rider
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4" /> Message
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-mint" /> Live trip shared with family
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-destructive">
              <Siren className="h-3.5 w-3.5" /> SOS · 112
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
