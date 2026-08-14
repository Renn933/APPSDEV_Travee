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
# Option A — just open it
open index.html

# Option B — any static server
npx serve .
```

`npm install` is **not required** (and there are no node_modules to commit).
