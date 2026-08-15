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
- **Trust, Calm & Vibrance visual identity** — Deep Navy structural elements, Vibrant Blue CTAs, Ice Blue content surfaces, and Slate text; WCAG-AA compliant contrast with a travel-feel hero.

---

## 🎨 Visual identity — "Trust, Calm & Vibrance"

Booking involves payment and trip planning, so the UI is designed to **project stability, trust and calm** while staying vibrant and readable. The blue palette evokes the sky and ocean — the very atmosphere of travel:

| Token | Role | Colors |
| --- | --- | --- |
| `--blue-900` / `--blue-800` | **Deep Navy** — dominant structural tone: brand, hero, loyalty card, login backdrop, active nav | `#0C1E3F` / `#1E3A8A` |
| `--blue-700` / `--blue-600` | **Vibrant Blue** — CTA buttons, links, key highlights, prices | `#1D4ED8` / `#2563EB` |
| `--ice` / `--white` | **Ice Blue / Clean White** — content cards and background sections | `#F0F9FF` / `#FFFFFF` |
| `--ink` / `--ink-soft` | **Slate** — high-contrast body text & secondary text | `#1E293B` / `#64748B` |

**Accessibility (WCAG AA)** — interactive surfaces (primary buttons, active nav, chips, step dots) and links use the deeper blue `#1D4ED8` (≈ 5.5:1 against white), so all normal-size text meets AA contrast. The brighter blue `#2563EB` is reserved for decorative borders, gradients and large elements.

**Travel-feel hero** — the Explore hero layers a blue sky glow, soft ocean wake lines, a diagonal sun ray and a ✈ paper-plane watermark over the Deep Navy → Navy → Sky Blue gradient. Category cover gradients (beach, mountain, city, cultural, adventure, wildlife) are all tinted to harmonize with the same blue palette.

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

---

## 📝 Changelog

### [2026-08-15] — Blue "Trust, Calm & Vibrance" palette by [@Renn933](https://github.com/Renn933)

Re-themed the entire design system from the original teal/navy palette to a **blue palette** that conveys **trust, calm, and vibrance** — perfectly matching the atmosphere of travel and the objective of a flight booking platform.

**What changed:**
- **CSS variables** in `css/style.css` (`:root`) — replaced all teal/coral tokens with a cohesive blue scale:
  - `--teal-900` → `--blue-900` (`#0C1E3F` — Deep Navy)
  - `--teal-800` → `--blue-800` (`#1E3A8A` — Navy)
  - `--teal-700` → `--blue-700` (`#1D4ED8` — Vibrant Blue, primary CTA)
  - `--teal-600` → `--blue-600` (`#2563EB` — Bright Blue)
  - `--teal-500` → `--blue-500` (`#3B82F6` — Sky Blue)
  - `--teal-100` → `--blue-100` (`#DBEAFE` — Light Blue)
  - `--teal-50` → `--blue-50` (`#EFF6FF` — Pale Blue)
  - `--coral` / `--coral-dark` → `--blue-700` / `--blue-800`
  - `--sand` → `--ice` (`#F0F9FF` — Ice Blue background)
  - Added `--sky` (`#0EA5E9`) and `--sky-light` (`#7DD3FC`) for vibrant accents
- **Gradients** — all category gradients (beach, mountain, city, cultural, adventure, wildlife) and the hero gradient re-tinted to blue tones
- **Shadows** — updated shadow color from teal-tinted to navy-tinted (`rgba(12,30,63,…)`)
- **Hero** — blue sky glow replaces the teal sunrise glow
- **Modal overlay** — updated to navy-tinted backdrop
- **Loyalty progress bar** — now uses blue → sky-light gradient
- **All component styles** — buttons, nav, chips, cards, tags, badges, steppers, toasts, tabs, and more updated to the new blue system

**Files modified:**
- `css/style.css` — full palette re-theme
- `README.md` — updated visual identity documentation + this changelog