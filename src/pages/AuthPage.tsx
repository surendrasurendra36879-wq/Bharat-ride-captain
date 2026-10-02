import { useState, type FormEvent } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MapPin, MessageSquare, ShieldCheck, Smartphone } from "lucide-react";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CITIES } from "@/data/cities";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";

const DEMO_OTP = "1234";
const DEFAULT_RETURN = "/captain";

export default function AuthPage() {
  const { user, signIn } = useAuth();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || DEFAULT_RETURN;

  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("blr");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to={returnTo} replace />;

  const digits = phone.replace(/\D/g, "");

  const handleDetails = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Enter your full name as per your driving licence.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setError("");
    setStep("otp");
  };

  const handleVerify = (event: FormEvent) => {
    event.preventDefault();
    if (otp.trim() !== DEMO_OTP) {
      setError(`Incorrect OTP. For this demo, use ${DEMO_OTP}.`);
      return;
    }
    setError("");
    signIn({ name: name.trim(), phone: `+91 ${digits}`, city });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <aside className="map-grid relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="hero-fade absolute inset-0" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative max-w-md space-y-6">
          <Badge variant="default">Captain onboarding · 42 cities</Badge>
          <h1 className="font-display text-4xl font-bold leading-tight">
            2.4 lakh captains. One app.{" "}
            <span className="text-gradient-saffron">Zero waiting for payouts.</span>
          </h1>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              { icon: ShieldCheck, text: "KYC approved the same day — licence, RC, photo." },
              { icon: Smartphone, text: "Ride requests, navigation and earnings in one screen." },
              { icon: MapPin, text: "Live surge zones show you where the money is." },
              { icon: MessageSquare, text: "Support in Hindi, Tamil, Telugu, Bangla & more." },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
          <p className="text-sm text-foreground">
            “Joined in March, cleared my bike loan by June. The daily payout is the real deal.”
          </p>
          <p className="mt-2 text-xs text-muted-foreground">— Rakesh T., Delhi · Gold captain</p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Logo />
            <Badge variant="outline">Captain app</Badge>
          </div>

          <div className="mb-6 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span
              className={cn(
                "flex items-center gap-1.5",
                step === "details" && "text-primary",
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full",
                  step === "details" ? "bg-primary text-primary-foreground" : "bg-mint text-white",
                )}
              >
                {step === "details" ? "1" : "✓"}
              </span>
              Your details
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className={cn("flex items-center gap-1.5", step === "otp" && "text-primary")}>
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full",
                  step === "otp" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                2
              </span>
              Verify OTP
            </span>
          </div>

          <Card>
            <CardContent className="p-6 sm:p-8">
              {step === "details" ? (
                <form onSubmit={handleDetails} className="space-y-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Start your captain journey</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sign in or create your account — it takes under two minutes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full name (as per licence)</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Arjun Verma"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile number</Label>
                    <div className="flex">
                      <span className="grid place-items-center rounded-l-xl border border-r-0 border-input bg-muted px-3 text-sm font-semibold text-muted-foreground">
                        +91
                      </span>
                      <Input
                        id="phone"
                        inputMode="numeric"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="rounded-l-none"
                        autoComplete="tel-national"
                        maxLength={12}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Your city</Label>
                    <div className="flex flex-wrap gap-2">
                      {CITIES.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setCity(option.id)}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                            city === option.id
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                  <Button type="submit" size="lg" className="w-full">
                    Continue
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    By continuing you agree to Bharat Rides' Terms & Privacy Policy.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-5">
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("details");
                        setError("");
                        setOtp("");
                      }}
                      className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Change details
                    </button>
                    <h2 className="font-display text-2xl font-bold">Verify your number</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      We sent a 4-digit code to <span className="text-foreground">+91 {digits}</span>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="••••"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                      className="h-14 text-center font-mono text-2xl tracking-[0.6em]"
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground">
                      Demo build — use <span className="font-semibold text-primary">{DEMO_OTP}</span> to
                      verify instantly.
                    </p>
                  </div>

                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                  <Button type="submit" size="lg" className="w-full">
                    <CheckCircle2 className="h-4 w-4" /> Verify & open dashboard
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Existing captain? Enter your number — we'll pull up your profile.
          </p>
        </div>
      </main>
    </div>
  );
}
