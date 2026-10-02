import { Banknote, Car, Clock, Navigation, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cityById } from "@/data/cities";
import { formatClock, formatINR, timeOf } from "@/lib/utils";
import { DAILY_GOAL, useCaptain } from "@/store/captain";

function TodayCard() {
  const { data, acceptanceRate } = useCaptain();
  const percent = Math.min(100, Math.round((data.today.earnings / DAILY_GOAL) * 100));
  const goalMet = data.today.earnings >= DAILY_GOAL;

  return (
    <Card className="overflow-hidden border-primary/30">
      <div className="bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Today's earnings
            </p>
            <p className="font-display text-4xl font-bold tabular">{formatINR(data.today.earnings)}</p>
          </div>
          <Badge variant={goalMet ? "secondary" : "outline"}>
            {goalMet ? "Goal smashed 🎉" : `Goal ${formatINR(DAILY_GOAL)}`}
          </Badge>
        </div>

        <div>
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{percent}% of daily goal</span>
            <span>
              {goalMet
                ? `+${formatINR(data.today.earnings - DAILY_GOAL)} above goal`
                : `${formatINR(DAILY_GOAL - data.today.earnings)} to go`}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${goalMet ? "bg-mint" : "bg-gradient-to-r from-primary to-mint"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Car, label: "Rides", value: String(data.today.rides) },
            { icon: Target, label: "Acceptance", value: `${acceptanceRate}%` },
            { icon: Clock, label: "Online", value: formatClock(data.today.onlineSeconds) },
            { icon: Navigation, label: "Distance", value: `${data.today.km} km` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-background/40 p-3">
              <stat.icon className="h-4 w-4 text-primary" />
              <p className="mt-1.5 text-lg font-semibold leading-tight tabular">{stat.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WeekChart() {
  const { data } = useCaptain();
  const max = Math.max(...data.week.values, 1);
  const total = data.week.values.reduce((sum, value) => sum + value, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">This week</CardTitle>
        <span className="text-sm font-semibold text-mint tabular">{formatINR(total)}</span>
      </CardHeader>
      <CardContent>
        <div className="flex h-28 items-end gap-2">
          {data.week.values.map((value, index) => {
            const isToday = index === data.week.values.length - 1;
            const height = Math.max(6, Math.round((value / max) * 100));
            return (
              <div key={`${data.week.labels[index]}-${index}`} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground tabular">
                  {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                </span>
                <div
                  title={`${data.week.labels[index]}: ${formatINR(value)}`}
                  className={`w-full rounded-md transition-all ${
                    isToday
                      ? "bg-gradient-to-t from-primary to-primary/60"
                      : "bg-secondary/50 hover:bg-secondary/70"
                  }`}
                  style={{ height: `${height}%` }}
                />
                <span
                  className={`text-[10px] ${isToday ? "font-semibold text-primary" : "text-muted-foreground"}`}
                >
                  {data.week.labels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function PayoutCard() {
  const { data } = useCaptain();

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint/15 text-mint-soft">
          <Banknote className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Next payout · tomorrow, 9:00 AM</p>
          <p className="truncate text-xs text-muted-foreground">Auto-transferred to {data.profile.upi}</p>
        </div>
        <Badge variant="secondary">Instant UPI</Badge>
      </CardContent>
    </Card>
  );
}

function RideHistory() {
  const { data } = useCaptain();
  const rides = data.rides.slice(0, 6);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Recent rides</CardTitle>
        <span className="text-xs text-muted-foreground">{data.lifetime.rides} lifetime</span>
      </CardHeader>
      <CardContent className="space-y-1">
        {rides.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No rides yet — go online to start earning.
          </p>
        )}
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/60"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground tabular">
              {(timeOf(ride.completedAt).split(" ")[1] ?? "").toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {ride.pickup} → {ride.drop}
              </p>
              <p className="text-xs text-muted-foreground">
                {ride.distanceKm} km · {timeOf(ride.completedAt)}
                {ride.tip ? ` · tip ₹${ride.tip}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular">
              {formatINR(ride.fare + ride.tip)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SideRail() {
  const { data } = useCaptain();
  const demand = cityById(data.profile.city).demand;

  return (
    <div className="space-y-4">
      <TodayCard />
      <div className="rounded-2xl border border-border bg-card px-5 py-3 text-xs text-muted-foreground shadow-card">
        <span className="font-semibold text-foreground">{demand}</span> · surge zones refresh every
        few minutes
      </div>
      <WeekChart />
      <PayoutCard />
      <RideHistory />
    </div>
  );
}
