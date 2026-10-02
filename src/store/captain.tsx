import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CAPTAIN_VEHICLES, RIDER_NAMES, cityById } from "@/data/cities";
import { randomBetween, randomOf } from "@/lib/utils";
import { useAuth, type User } from "@/store/auth";

export const DAILY_GOAL = 2000;
export const OFFER_SECONDS = 15;
const PICKUP_SECONDS = 6;
const DROP_SECONDS = 11;
const DATA_KEY = "bharatrides.captain.data.v1";

export type CaptainStatus = "offline" | "searching" | "incoming" | "trip";
export type Leg = "pickup" | "onroute" | "arrived";

export type Offer = {
  id: string;
  rider: string;
  rating: number;
  pickup: string;
  drop: string;
  distanceKm: number;
  durationMin: number;
  fare: number;
  surge: number;
};

export type RideRecord = Offer & {
  tip: number;
  completedAt: number;
};

export type CaptainData = {
  ownerId: string | null;
  profile: {
    name: string;
    city: string;
    vehicle: string;
    upi: string;
    since: number;
  };
  today: {
    date: string;
    earnings: number;
    rides: number;
    km: number;
    onlineSeconds: number;
    requested: number;
    accepted: number;
  };
  week: { labels: string[]; values: number[] };
  rides: RideRecord[];
  lifetime: { earnings: number; rides: number; km: number };
};

export type Flash = { id: number; title: string; detail: string };

type CaptainContextValue = {
  data: CaptainData;
  status: CaptainStatus;
  offer: Offer | null;
  secondsLeft: number;
  trip: Offer | null;
  leg: Leg;
  progress: number;
  overallProgress: number;
  flash: Flash | null;
  acceptanceRate: number;
  tier: "Silver" | "Gold" | "Platinum";
  goOnline: () => void;
  goOffline: () => void;
  acceptOffer: () => void;
  declineOffer: () => void;
  completeTrip: () => void;
  clearFlash: () => void;
};

const CaptainContext = createContext<CaptainContextValue | null>(null);

const isoDate = (ts: number) => new Date(ts).toISOString().slice(0, 10);
const weekdayLabel = (ts: number) =>
  new Date(ts).toLocaleDateString("en-IN", { weekday: "short" });

function buildOffer(cityId: string): Offer {
  const city = cityById(cityId);
  const route = randomOf(city.routes);
  const km = Math.round(route.km * randomBetween(0.92, 1.1) * 10) / 10;
  const surge = Math.random() < 0.3 ? Math.round(randomBetween(1.2, 1.6) * 10) / 10 : 1;
  const fare = Math.round(((35 + km * 17) * surge) / 5) * 5;
  return {
    id: `ride_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e4).toString(36)}`,
    rider: randomOf(RIDER_NAMES),
    rating: Math.round(randomBetween(4.3, 5) * 10) / 10,
    pickup: route.pickup,
    drop: route.drop,
    distanceKm: km,
    durationMin: Math.round(km * 2.3 + 5),
    fare,
    surge,
  };
}

function lastSevenLabels(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    weekdayLabel(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
  );
}

function seedRides(): RideRecord[] {
  const now = Date.now();
  const city = cityById("blr");
  const picks: Array<[number, number, number, number]> = [
    [0, 2.4 * 3600 * 1000, 145, 20],
    [1, 4.1 * 3600 * 1000, 118, 0],
    [3, 3.2 * 3600 * 1000, 262, 30],
    [2, 5.5 * 3600 * 1000, 96, 10],
  ];
  return picks.map(([routeIdx, ago, fare, tip], index) => {
    const route = city.routes[routeIdx % city.routes.length];
    return {
      id: `ride_seed_${index}`,
      rider: RIDER_NAMES[(index * 3) % RIDER_NAMES.length],
      rating: 4.6 + (index % 4) / 10,
      pickup: route.pickup,
      drop: route.drop,
      distanceKm: route.km,
      durationMin: Math.round(route.km * 2.3 + 5),
      fare,
      surge: 1,
      tip,
      completedAt: now - ago,
    };
  });
}

function seedData(owner: User | null): CaptainData {
  const now = Date.now();
  const seededToday = 640;
  return {
    ownerId: owner?.id ?? null,
    profile: {
      name: owner?.name ?? "Captain",
      city: owner?.city ?? "blr",
      vehicle: randomOf(CAPTAIN_VEHICLES),
      upi: `${(owner?.name ?? "captain").toLowerCase().replace(/[^a-z]+/g, ".")}@okaxis`,
      since: now,
    },
    today: {
      date: isoDate(now),
      earnings: seededToday,
      rides: 3,
      km: 27.4,
      onlineSeconds: 5400,
      requested: 3,
      accepted: 3,
    },
    week: {
      labels: lastSevenLabels(),
      values: [1180, 940, 1520, 1360, 1740, 2210, seededToday],
    },
    rides: seedRides(),
    lifetime: { earnings: 84320, rides: 512, km: 3180 },
  };
}

function rolloverIfNeeded(data: CaptainData): CaptainData {
  const today = isoDate(Date.now());
  if (data.today.date === today) return data;

  const label = weekdayLabel(Date.now());
  const labels = data.week.labels.length === 7 ? data.week.labels.slice(1) : lastSevenLabels();
  const values = data.week.values.length === 7 ? data.week.values.slice(1) : [0, 0, 0, 0, 0, 0];
  labels.push(label);
  values.push(0);

  return {
    ...data,
    today: {
      date: today,
      earnings: 0,
      rides: 0,
      km: 0,
      onlineSeconds: 0,
      requested: 0,
      accepted: 0,
    },
    week: { labels, values },
  };
}

function loadData(owner: User | null): CaptainData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return seedData(owner);
    const parsed = JSON.parse(raw) as CaptainData;
    if (!parsed?.profile || !parsed?.today || !parsed?.week) return seedData(owner);
    if (owner && parsed.ownerId !== owner.id) return seedData(owner);
    return rolloverIfNeeded(parsed);
  } catch {
    return seedData(owner);
  }
}

export function CaptainProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<CaptainData>(() => loadData(user));
  const [status, setStatus] = useState<CaptainStatus>("offline");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(OFFER_SECONDS);
  const [trip, setTrip] = useState<Offer | null>(null);
  const [leg, setLeg] = useState<Leg>("pickup");
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState<Flash | null>(null);

  // Persist captain data
  useEffect(() => {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch {
      // storage unavailable — keep running in memory
    }
  }, [data]);

  // While online: keep hunting for the next ride request
  useEffect(() => {
    if (status !== "searching") return;
    const timer = window.setTimeout(() => {
      setOffer(buildOffer(data.profile.city));
      setSecondsLeft(OFFER_SECONDS);
      setStatus("incoming");
    }, randomBetween(3500, 7000));
    return () => window.clearTimeout(timer);
  }, [status, data.profile.city]);

  // Countdown for the incoming request
  useEffect(() => {
    if (status !== "incoming") return;
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const left = OFFER_SECONDS - (Date.now() - startedAt) / 1000;
      if (left <= 0) {
        window.clearInterval(interval);
        setSecondsLeft(0);
        setOffer(null);
        setData((d) => ({ ...d, today: { ...d.today, requested: d.today.requested + 1 } }));
        setStatus("searching");
      } else {
        setSecondsLeft(left);
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [status]);

  // Active trip: drive pickup leg, then drop leg
  useEffect(() => {
    if (status !== "trip" || !trip) return;
    const startedAt = Date.now();
    setLeg("pickup");
    setProgress(0);
    const interval = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      if (elapsed < PICKUP_SECONDS) {
        setLeg("pickup");
        setProgress(elapsed / PICKUP_SECONDS);
      } else if (elapsed < PICKUP_SECONDS + DROP_SECONDS) {
        setLeg("onroute");
        setProgress((elapsed - PICKUP_SECONDS) / DROP_SECONDS);
      } else {
        setLeg("arrived");
        setProgress(1);
        window.clearInterval(interval);
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [status, trip]);

  // Track online time
  useEffect(() => {
    if (status === "offline") return;
    const interval = window.setInterval(() => {
      setData((d) => ({ ...d, today: { ...d.today, onlineSeconds: d.today.onlineSeconds + 1 } }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [status]);

  // Auto-dismiss flash toasts
  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 4200);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const goOnline = useCallback(() => setStatus("searching"), []);

  const goOffline = useCallback(() => {
    if (status === "trip") return;
    setOffer(null);
    setStatus("offline");
  }, [status]);

  const acceptOffer = useCallback(() => {
    if (!offer) return;
    setTrip(offer);
    setOffer(null);
    setData((d) => ({
      ...d,
      today: { ...d.today, requested: d.today.requested + 1, accepted: d.today.accepted + 1 },
    }));
    setStatus("trip");
  }, [offer]);

  const declineOffer = useCallback(() => {
    if (!offer) return;
    setOffer(null);
    setData((d) => ({ ...d, today: { ...d.today, requested: d.today.requested + 1 } }));
    setStatus("searching");
  }, [offer]);

  const completeTrip = useCallback(() => {
    if (!trip || leg !== "arrived") return;
    const tip = Math.random() < 0.35 ? randomOf([10, 20, 30, 50]) : 0;
    const total = trip.fare + tip;
    const record: RideRecord = { ...trip, tip, completedAt: Date.now() };

    setData((d) => {
      const weekValues = [...d.week.values];
      weekValues[weekValues.length - 1] = (weekValues[weekValues.length - 1] ?? 0) + total;
      return {
        ...d,
        today: {
          ...d.today,
          earnings: d.today.earnings + total,
          rides: d.today.rides + 1,
          km: Math.round((d.today.km + trip.distanceKm) * 10) / 10,
        },
        week: { ...d.week, values: weekValues },
        rides: [record, ...d.rides].slice(0, 40),
        lifetime: {
          earnings: d.lifetime.earnings + total,
          rides: d.lifetime.rides + 1,
          km: Math.round((d.lifetime.km + trip.distanceKm) * 10) / 10,
        },
      };
    });

    setFlash({
      id: Date.now(),
      title: `+₹${total} added to today's earnings`,
      detail: tip ? `Fare ₹${trip.fare} · Rider tip ₹${tip}` : `Fare ₹${trip.fare} · ${trip.rider}`,
    });
    setTrip(null);
    setProgress(0);
    setLeg("pickup");
    setStatus("searching");
  }, [trip, leg]);

  const clearFlash = useCallback(() => setFlash(null), []);

  const overallProgress = useMemo(() => {
    if (status !== "trip") return 0;
    if (leg === "arrived") return 1;
    const legShare = leg === "pickup" ? 0.35 : 0.65;
    return leg === "pickup" ? progress * legShare : 0.35 + progress * legShare;
  }, [status, leg, progress]);

  const acceptanceRate = useMemo(() => {
    const { requested, accepted } = data.today;
    if (requested === 0) return 100;
    return Math.round((accepted / requested) * 100);
  }, [data.today]);

  const tier = useMemo<"Silver" | "Gold" | "Platinum">(() => {
    if (data.lifetime.earnings >= 150000) return "Platinum";
    if (data.lifetime.earnings >= 50000) return "Gold";
    return "Silver";
  }, [data.lifetime.earnings]);

  const value = useMemo<CaptainContextValue>(
    () => ({
      data,
      status,
      offer,
      secondsLeft,
      trip,
      leg,
      progress,
      overallProgress,
      flash,
      acceptanceRate,
      tier,
      goOnline,
      goOffline,
      acceptOffer,
      declineOffer,
      completeTrip,
      clearFlash,
    }),
    [
      data,
      status,
      offer,
      secondsLeft,
      trip,
      leg,
      progress,
      overallProgress,
      flash,
      acceptanceRate,
      tier,
      goOnline,
      goOffline,
      acceptOffer,
      declineOffer,
      completeTrip,
      clearFlash,
    ],
  );

  return <CaptainContext.Provider value={value}>{children}</CaptainContext.Provider>;
}

export function useCaptain(): CaptainContextValue {
  const ctx = useContext(CaptainContext);
  if (!ctx) throw new Error("useCaptain must be used within CaptainProvider");
  return ctx;
}
