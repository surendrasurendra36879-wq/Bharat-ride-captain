import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Clock,
  Flame,
  Languages,
  Navigation,
  Percent,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/store/auth";

const NAV_LINKS = [
  { href: "#features", label: "Why captain" },
  { href: "#earnings", label: "Earnings" },
  { href: "#how", label: "How it works" },
  { href: "#stories", label: "Stories" },
];

const MARQUEE_CITIES = [
  "Bengaluru",
  "Delhi NCR",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kochi",
  "Indore",
  "Chandigarh",
  "Coimbatore",
];

const FEATURES = [
  {
    icon: Banknote,
    title: "Money in minutes, not days",
    body: "Every ride settles to your UPI within minutes — 24×7, weekends included. No weekly waiting.",
  },
  {
    icon: Percent,
    title: "You keep 90% of every fare",
    body: "One transparent commission, printed on every trip. No hidden deductions, no mystery penalties.",
  },
  {
    icon: Flame,
    title: "Demand that actually pays",
    body: "Live surge zones and hot-area nudges show you where riders are paying more, minute by minute.",
  },
  {
    icon: ShieldCheck,
    title: "Safety you can feel",
    body: "One-tap SOS, live trip sharing with family, and a captain safety desk that answers in 30 seconds.",
  },
  {
    icon: Languages,
    title: "Support in your language",
    body: "Hindi, Tamil, Telugu, Bangla, Marathi and more — real humans on chat and calls, around the clock.",
  },
  {
    icon: Trophy,
    title: "Weekly streak bonuses",
    body: "Hit your acceptance and hour streaks to unlock ₹2,000–₹5,000 in bonuses every single week.",
  },
];

const STEPS = [
  {
    icon: Smartphone,
    title: "Sign up in 2 minutes",
    body: "Enter your mobile number, pick your city, and keep your driving licence handy. That's it.",
  },
  {
    icon: BadgeCheck,
    title: "KYC approved same day",
    body: "Upload your licence, RC and a selfie. Most captains are approved within ten minutes.",
  },
  {
    icon: Navigation,
    title: "Go online and earn",
    body: "Accept requests, follow the in-app route, and watch your earnings land after every drop.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I plan my month around the daily payout now. EMI clears on the 3rd, savings on the 10th, and I never chase anyone for cash.",
    name: "Rakesh T.",
    meta: "Delhi · Gold captain · 2 years",
    rating: 5,
  },
  {
    quote:
      "As a woman captain, the SOS button and live trip sharing mean my family never worries about me during night rides.",
    name: "Anjali M.",
    meta: "Bengaluru · 180 rides/month",
    rating: 5,
  },
  {
    quote:
      "The surge map changed my income. I finish my airport queue by 11 pm and still beat my old office salary.",
    name: "Imran S.",
    meta: "Hyderabad · Platinum captain",
    rating: 5,
  },
];

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl space-y-3 ${center ? "mx-auto text-center" : ""}`}>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl text-balance">
        {title}
      </h2>
      {sub && <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{sub}</p>}
    </div>
  );
}

function SiteNav() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-highway-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link to="/captain">
              <Button size="sm" className="sm:h-11 sm:px-5">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth?returnTo=%2Fcaptain">
                <Button variant="ghost" size="sm" className="sm:h-11 sm:px-4">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth?returnTo=%2Fcaptain">
                <Button size="sm" className="sm:h-11 sm:px-5">
                  Start earning
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="hero-fade absolute inset-0" />
      <div className="map-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <div>
          <Reveal>
            <Badge variant="default">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Onboarding captains in 42 Indian cities
            </Badge>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl text-balance">
              Own the road.
              <br />
              Earn on <span className="text-gradient-saffron">your terms.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Bharat Rides Captain puts you in the driver's seat — live ride requests, honest
              fares on every trip, and payouts that hit your UPI before you reach the next pickup.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/auth?returnTo=%2Fcaptain">
                <Button size="lg">
                  Start earning today <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="outline">
                  See how it works
                </Button>
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="flex">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </span>
                4.8 on Play Store
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-mint" /> 2.4L+ active captains
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-mint" /> Zero joining fee
              </span>
            </div>
          </Reveal>
        </div>

        {/* Live request mock */}
        <Reveal delay={0.2} className="relative">
          <div className="map-grid absolute -inset-8 rounded-[2.5rem] opacity-50" />
          <div className="relative mx-auto max-w-sm animate-float space-y-4">
            <Card className="overflow-hidden border-primary/40 p-5 shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="default">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  New ride request
                </Badge>
                <span className="text-xs text-muted-foreground">0:15</span>
              </div>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-mint" />
                  Koramangala 5th Block
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
                  MG Road Metro
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="font-display text-2xl font-bold tabular">₹187</p>
                  <p className="text-xs text-muted-foreground">6.8 km · ~18 min</p>
                </div>
                <span className="inline-flex h-11 items-center rounded-xl bg-secondary px-5 text-sm font-semibold text-white">
                  Accept ride
                </span>
              </div>
            </Card>

            <div className="absolute -right-3 -bottom-6 flex items-center gap-2 rounded-2xl border border-mint/50 bg-card px-4 py-3 shadow-card sm:-right-8">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-mint/15 text-mint-soft">
                <Banknote className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-mint-soft">+₹187 credited</p>
                <p className="text-[11px] text-muted-foreground">Settled to UPI · 4 seconds</p>
              </div>
            </div>

            <div className="absolute -left-3 -top-6 rounded-2xl border border-border bg-card px-4 py-3 shadow-card sm:-left-8">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Today so far
              </p>
              <p className="font-display text-xl font-bold tabular">₹1,640</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CityStrip() {
  const list = [...MARQUEE_CITIES, ...MARQUEE_CITIES];

  return (
    <section className="border-y border-border bg-highway-900/60 py-5">
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max gap-10">
          {list.map((city, index) => (
            <span
              key={`${city}-${index}`}
              className="flex shrink-0 items-center gap-3 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Why captains stay"
          title="Built around what drivers actually complain about"
          sub="No black-box deductions, no waiting for weekly settlement, no support bots at 2 am. Just an app that respects your time on the road."
          center
        />
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.06}>
            <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary/40">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function EarningsCalculator() {
  const [hours, setHours] = useState(6);

  const ridesPerHour = 1.6;
  const perRide = 145;
  const workingDays = 6;
  const ridesPerDay = Math.round(hours * ridesPerHour);
  const daily = Math.round(hours * ridesPerHour * perRide);
  const weekly = daily * workingDays;
  const monthly = Math.round(weekly * 4.33);

  return (
    <section id="earnings" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <Card className="map-grid overflow-hidden border-primary/30">
          <CardContent className="grid gap-10 p-6 sm:p-10 lg:grid-cols-2">
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Earnings calculator"
                title="Move the slider. See your week."
                sub="Based on average metro captain data: ₹145 per ride, 1.6 rides per hour, six working days a week."
              />

              <div className="space-y-6 rounded-2xl border border-border bg-background/50 p-6">
                <div>
                  <div className="mb-3 flex items-baseline justify-between">
                    <label htmlFor="hours" className="text-sm font-semibold">
                      Hours you want to drive
                    </label>
                    <span className="font-display text-2xl font-bold text-primary tabular">
                      {hours}h
                    </span>
                  </div>
                  <input
                    id="hours"
                    type="range"
                    min={2}
                    max={12}
                    step={1}
                    value={hours}
                    onChange={(event) => setHours(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[#ff8a1f]"
                  />
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>2h · part-time</span>
                    <span>12h · full-time</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Per day
                    </p>
                    <p className="mt-1 font-display text-xl font-bold tabular">
                      {formatINR(daily)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" /> Per week
                    </p>
                    <p className="mt-1 font-display text-xl font-bold tabular">
                      {formatINR(weekly)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Estimated monthly earnings
              </p>
              <p className="mt-3 font-display text-5xl font-extrabold text-gradient-saffron tabular sm:text-6xl">
                {formatINR(monthly)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                That's about <span className="font-semibold text-foreground">{formatINR(weekly)}</span>{" "}
                every week driving {hours} hours a day, {workingDays} days a week.
              </p>

              <ul className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                {[
                  `${ridesPerDay} rides a day at ₹${perRide} average fare`,
                  "90% of every fare stays with you",
                  "Daily payouts to your UPI — no minimum balance",
                  "Surge hours can add 30–60% on top",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-muted-foreground">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint/15 text-[10px] font-bold text-mint-soft">
                      ✓
                    </span>
                    {line}
                  </li>
                ))}
              </ul>

              <Link to="/auth?returnTo=%2Fcaptain" className="mt-7">
                <Button size="lg" className="w-full">
                  Claim these earnings <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Estimates, not guarantees. Actual earnings vary by city, hour and demand.
              </p>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title="From signup to first fare in one afternoon"
          sub="Three steps, one afternoon, and you're earning on India's roads."
          center
        />
      </Reveal>
      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        {STEPS.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.1} className="relative">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="relative grid h-16 w-16 place-items-center rounded-2xl border border-primary/40 bg-card text-primary shadow-glow">
                <step.icon className="h-7 w-7" />
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stories() {
  return (
    <section id="stories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Captain stories"
          title="India is driving Bharat Rides"
          sub="Over 2.4 lakh captains run their business on the app — from airport queues to late-night metro runs."
          center
        />
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((story, index) => (
          <Reveal key={story.name} delay={index * 0.08}>
            <Card className="flex h-full flex-col justify-between gap-6 p-6 transition-colors hover:border-primary/40">
              <div>
                <div className="flex gap-1">
                  {Array.from({ length: story.rating }).map((_, star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">“{story.quote}”</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-semibold">{story.name}</p>
                <p className="text-xs text-muted-foreground">{story.meta}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="hero-fade relative overflow-hidden rounded-3xl border border-primary/30 px-6 py-14 text-center sm:px-12">
          <div className="map-grid absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-2xl space-y-5">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-balance">
              Your road. Your rules. <span className="text-gradient-saffron">Your earnings.</span>
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Complete KYC in ten minutes, go online tonight, and get your first payout before you
              park the car.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth?returnTo=%2Fcaptain">
                <Button size="lg">
                  Become a captain <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth?returnTo=%2Fcaptain">
                <Button size="lg" variant="outline">
                  I already drive with you
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function SiteFooter() {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "Why captain", href: "#features" },
        { label: "Earnings calculator", href: "#earnings" },
        { label: "How it works", href: "#how" },
        { label: "Captain stories", href: "#stories" },
      ],
    },
    {
      title: "Captains",
      links: [
        { label: "Safety & SOS", href: "#features" },
        { label: "Payouts", href: "#earnings" },
        { label: "Weekly bonuses", href: "#features" },
        { label: "Sign in", href: "#top" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Bharat Rides", href: "#top" },
        { label: "Newsroom", href: "#top" },
        { label: "Careers", href: "#top" },
        { label: "Contact", href: "#top" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-highway-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            The captain-first ride-hailing app for India. Transparent fares, daily payouts, and a
            safety net that works.
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">4.8★ Play Store</Badge>
            <Badge variant="outline">2.4L+ captains</Badge>
          </div>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="font-display text-sm font-semibold uppercase tracking-widest">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span>© 2026 Bharat Rides Technologies Pvt Ltd · Bengaluru, India</span>
          <span className="flex items-center gap-4">
            <a href="#top" className="transition-colors hover:text-primary">
              Terms
            </a>
            <a href="#top" className="transition-colors hover:text-primary">
              Privacy
            </a>
            <span>Made in 🇮🇳</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main>
        <Hero />
        <CityStrip />
        <Features />
        <EarningsCalculator />
        <HowItWorks />
        <Stories />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
