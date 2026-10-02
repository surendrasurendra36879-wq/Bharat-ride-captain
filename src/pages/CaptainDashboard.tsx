import { AnimatePresence } from "framer-motion";
import { Car, IndianRupee, Route, Star, TrendingUp } from "lucide-react";
import ActiveTripCard from "@/components/captain/ActiveTripCard";
import CaptainHeader from "@/components/captain/CaptainHeader";
import FlashToast from "@/components/captain/FlashToast";
import SideRail from "@/components/captain/SideRail";
import StatusPanel from "@/components/captain/StatusPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cityById } from "@/data/cities";
import { formatINR, formatINRCompact } from "@/lib/utils";
import { CaptainProvider, useCaptain } from "@/store/captain";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function DemandCard() {
  const { data } = useCaptain();
  const city = cityById(data.profile.city);
  const bonuses = ["1.0×", "1.3×", "1.5×"];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Hot zones near you</CardTitle>
        <Badge variant="secondary">{city.name}</Badge>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {city.routes.slice(0, 3).map((route, index) => (
          <div
            key={route.pickup}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{route.pickup}</p>
              <p className="text-xs text-muted-foreground">{route.km} km popular route</p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {bonuses[index]}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DashboardShell() {
  const { status, tier, data } = useCaptain();
  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const firstName = data.profile.name.split(" ")[0] || "Captain";
  const avgPerRide = data.lifetime.rides > 0 ? data.lifetime.earnings / data.lifetime.rides : 0;

  return (
    <div className="min-h-screen">
      <CaptainHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {dateLabel}
            </p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              {greeting()}, {firstName} 👋
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={tier === "Silver" ? "outline" : "default"}>
              <Star className="h-3 w-3" /> {tier} captain
            </Badge>
            <Badge variant="secondary">
              <IndianRupee className="h-3 w-3" /> {formatINRCompact(data.lifetime.earnings)} lifetime
            </Badge>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <AnimatePresence mode="wait" initial={false}>
              {status === "trip" ? (
                <ActiveTripCard key="trip" />
              ) : (
                <StatusPanel key="console" />
              )}
            </AnimatePresence>
            <DemandCard />
          </div>
          <SideRail />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: IndianRupee, label: "Lifetime earnings", value: formatINR(data.lifetime.earnings) },
            { icon: Car, label: "Rides completed", value: String(data.lifetime.rides) },
            { icon: Route, label: "Distance covered", value: `${data.lifetime.km} km` },
            { icon: TrendingUp, label: "Avg per ride", value: formatINR(avgPerRide) },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tabular">{item.value}</p>
                  <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
          <span>Bharat Rides Captain · Built for India's roads</span>
          <span>Emergency support · Dial 112 · Captain helpline 1800-200-4444</span>
        </footer>
      </main>
      <FlashToast />
    </div>
  );
}

export default function CaptainDashboard() {
  return (
    <CaptainProvider>
      <DashboardShell />
    </CaptainProvider>
  );
}
