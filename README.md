# ✈ Travee — Philippines & International Flight Booking

Travee is a **flight booking app** — **domestic routes across the Philippines and international routes from Manila (MNL)** — built entirely with **vanilla HTML, CSS and JavaScript**. There is no server, no database, no framework and no build step — everything runs in the browser.

> **Open the app:** just open `index.html` in any modern browser.
> **Or serve it statically:** `npx serve .` (or any static file server) and visit the printed URL.

---

## ✅ How it meets the brief

### Five+ distinct screens (hash-routed SPA views)
The app swaps entire views through a small hash router — each is a separate screen, not a section of one page:

| Route | Screen |
| --- | --- |
| `#/login` | Sign in / create profile (demo, localStorage) |
| `#/` | **Explore** — hero, Domestic/International toggle, search, filters, sortable grid |
| `#/destination/:id` | **Flight detail** — class picker, travelers, departure date, add to cart |
| `#/cart` | **Cart** — traveler steppers, promo codes, order summary |
| `#/checkout` | **Checkout** — 2-step traveler info → review & confirm |
| `#/confirmation/:id` | **Confirmation** — receipt + loyalty points |
| `#/wishlist` | **Saved flights** — wishlist with quick actions |
| `#/profile` | **Profile** — account, loyalty tier, booking history |

### Three+ features that hold and change state
- **Cart** — add/remove flights, adjust travelers, clear, persist to localStorage.
- **Loyalty points / score** — earn points per booking, tier up (Explorer → Legend), cancel deducts points.
- **Saved list** — wishlist toggle from any route.
- **Filters** — search, Domestic/International scope, region chips, sort, price cap.
- **Booking** — multi-step checkout that creates persistent bookings (with booking history).

### Data-driven rendering
All routes, regions, flight classes, coupons and loyalty tiers live as **JavaScript data** in `js/data.js` — every route carries a fare (₱), flight time, airline and a local photo from `images/`. View markup is generated from that data — no copy-pasted HTML anywhere.

### Responsive
A mobile-first layout with breakpoints (900px, 640px): grids collapse, the checkout two-column collapses, and nav adapts. Tested on phone and laptop widths.

### Polish
- **Empty states** — empty cart, empty wishlist, no search results, no bookings.
- **Validation** — inline errors on login + checkout (name, email, phone).
- **Confirmations** — cancel/remove/logout use a confirm modal; bookings get a success screen + toast.
- **Loading states** — skeleton cards, spinner buttons, artificial latency.
- **Transitions** — view fade-ups, card hover lifts, toast slide-ins, cart badge bump, modal scale-in.
- **Consistent design system** — CSS variables, shared buttons/cards/chips/forms.
- **High-trust visual identity** — a balanced triadic palette: Soft Sand/Cream + Clean White neutrals (~60%) with Ocean Blue, Rose and Fresh Green hue families used fairly (~13% each); WCAG-AA compliant contrast with a travel-feel hero.

---

## 🎨 Visual identity — Balanced triadic (Blue · Rose · Green)

Booking involves payment and trip planning, so the UI is designed to **project stability and security** while staying clean and readable. The palette uses a **balanced triadic** colour scheme — three hues spaced ~120° apart on the colour wheel: **Ocean Blue (≈206°)** (a recommended travel blue), **Rose (≈333°)** and **Fresh Green (≈88°)** — used **fairly** (no single dominant hue) over neutral sand/cream surfaces:

- **Neutrals** — Soft Sand/Cream + Clean White carry every background, card and surface so content stays readable.
- **Blue (≈206°)** — ocean/sky/trust: links, primary buttons, active nav, prices, focus & active states.
- **Rose (≈333°)** — sunset warmth: the primary CTAs ("Book now", "Add to cart", "Checkout", "Continue", "Confirm & book"), the cart count badge, rating stars and the wishlist-saved state.
- **Green (≈88°)** — nature/eco: loyalty points, success/done states, ghost buttons, category tags and coupons.

| Token | Hue | Role | Colors |
| --- | --- | --- | --- |
| `--sand` / `--white` | — | **Soft Sand/Cream / Clean White** — backgrounds and content surfaces | `#F2E9D8` / `#FFFFFF` |
| `--blue-900` → `--blue-600` | ~206° | **Ocean Blue** — brand, headings, hero, links, primary buttons, prices | `#0A2E52` → `#1E7FD1` |
| `--rose-700` / `--rose-600` | ~333° | **Rose** — CTAs, cart badge, saved/selected states (white text on the deep fill) | `#C81E5A` / `#E0407A` |
| `--green-800` / `--green-600` | ~88° | **Fresh Green** — points pill, ghost buttons, done/success, category tags | `#4A7A0A` / `#74B816` |
| `--ink` / `--ink-soft` | — | **Deep Slate-Teal** — high-contrast body text & secondary text | `#2B3A37` / `#566661` |

**Accessibility (WCAG AA)** — body text is Deep Slate-Teal `#2B3A37` (≈ 11.9:1 on white). Links and primary actions use ocean blue `#1560A0` (≈ 6.5:1). CTA buttons pair the deep rose fill `#C81E5A` with **white text** (≈ 5.5:1) plus a matching `#C81E5A` border for edge definition. Fresh Green `#4A7A0A` carries white text on the points pill (≈ 5.2:1) and reads as dark text on the light-green tints.

**Travel-feel hero** — the Explore hero layers a warm **rose sunrise glow**, soft ocean wake lines, a diagonal sun ray and a ✈ paper-plane watermark over the deep-blue → ocean → rose gradient. Category cover gradients cycle the three triad hues so every hue appears and they harmonize with the palette.

Everything is driven by CSS variables in `css/style.css` (`:root`), so the palette can be re-themed in one place.

---

## 🔐 Honesty about data & "login"

Everything is a **demo**:
- **"Logging in"** is a fake screen backed by **localStorage** — the interface is real, the security is not. Any name/email/password works (password length ≥ 4).
- **"Saving data"** means localStorage. All bookings, carts, wishlists and points live in **one browser, one computer** — they won't follow you to another device.
- There are **no real payments**, no real accounts, and no server/API — the only "database" is your browser's localStorage under the key `travee_state_v2`.

### Demo promo codes
- `TRAVEE10` → 10% off
- `EXPLORE50` → ₱50 off

---

## 📁 File structure

```
index.html            App shell (header, footer, mount point)
css/style.css         Full design system (responsive)
images/               Destination photos (local, Wikimedia Commons)
js/data.js            All content as JS data (routes, regions, fares, airlines, photos)
js/state.js           Single source of truth, persisted to localStorage
js/utils.js           Money/date/validation, toast, confirm modal, card markup
js/router.js          Hash router with auth guarding + chrome updates
js/views/             One file per screen
js/app.js             Bootstrap + global header actions
```

---

## ▶ Run commands

Since this is pure vanilla code there is **no install/build step**:

```
# Option A — just open it (macOS/Linux)
open index.html

# Option A (Windows)
start index.html

# Option B — any static server
npx serve .
```

`npm install` is **not required** (and there are no node_modules to commit).
