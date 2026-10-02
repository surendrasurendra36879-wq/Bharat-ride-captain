# Bharat Rides Captain

The captain (driver) app for **Bharat Rides** — go online, accept ride requests, complete trips, and watch your earnings land in real time. Built as a fully client-side React PWA-style experience themed for Indian roads.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** with a shadcn-style token system (`src/index.css`, `tailwind.config.js`)
- **shadcn-style components** (button, card, badge, input, label, switch)
- **Framer Motion** for transitions and reveals
- **React Router** for routing with a `RequireAuth` guard
- Local session + captain state persisted to `localStorage`

## Run

```bash
bun install
bun run dev        # dev server (binds 0.0.0.0, honours $PORT)
bun tsc -b --noEmit  # typecheck
```

## Routes

| Route       | Description                                                                 |
| ----------- | --------------------------------------------------------------------------- |
| `/`         | Landing page — hero, features, earnings calculator, captain stories, CTA    |
| `/auth`     | Two-step signup/sign-in (name + mobile, then OTP). Falls back to `/captain` |
| `/captain`  | Protected captain console — protected by `RequireAuth`                      |

Demo OTP: **1234**

## The captain console

- **Online/offline toggle** with live status (offline → searching → incoming request → on trip)
- **Ride request cards** with a 15-second countdown ring, surge pricing, and fare estimate
- **Active trip view** with pickup/drop legs, animated route progress, and completion payout
- **Today's earnings** against a ₹2,000 daily goal, acceptance rate, online time, distance
- **Weekly bar chart**, next-payout card (UPI), and recent ride history
- **Flash toasts** when a fare + tip is credited

State lives in `src/store/captain.tsx` (simulation engine + persistence) and
`src/store/auth.tsx` (session). City routes and riders come from `src/data/cities.ts`.

## Notes

- The trip simulator is client-side by design for this demo. To go multi-device,
  move `src/store/*` onto a realtime backend (e.g. Convex) without changing the UI layer.
