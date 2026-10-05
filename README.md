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
- **Validation** — inline errors on login + checkout (name, email, phone, password confirmation), with show/hide password and a live strength meter on sign-up.
- **Confirmations** — cancel/remove/logout use a confirm modal; bookings get a success screen + toast.
- **Loading states** — skeleton cards, spinner buttons, artificial latency.
- **Transitions** — view fade-ups, card hover lifts, toast slide-ins, cart badge bump, modal scale-in.
- **Consistent design system** — CSS variables, shared buttons/cards/chips/forms.
- **High-trust visual identity** — a split-complementary palette with blue dominant (~90% of surface): Deep Sapphire + Sky Blue carry the UI, while Sunset Coral and Marigold are reserved for CTAs, filters and details; WCAG-AA contrast with a travel-feel hero.

---

## 🎨 Visual identity — Split-complementary (Blue · Coral · Marigold)

Booking involves payment and trip planning, so the UI is designed to **project stability and security** while staying clean and readable. The palette is **split-complementary on blue**: a single dominant hue (blue) plus the two hues flanking its direct opposite. Blue occupies roughly **90% of the visual space**, and the two warm hues are rationed to about **10%** and used **only for action items and important details** — never for large surfaces.

- **Blue (dominant, ~90%)** — Deep Sapphire for the navigation bar, footer, headings and structure (the "anchor in security" layer); Sky Blue for links, active states, icons and borders.
- **Sunset Coral (~5%)** — the **primary CTA colour**, reserved for the ultimate actions only: *Book now*, *Checkout*, *Confirm & book*, *Continue*. Because it sits almost opposite blue on the wheel, it jumps off the screen.
- **Marigold (~5%)** — the **secondary action colour**, for filters, rating stars, badges, loyalty points and deal highlights. It pairs warmly with blue without competing with coral.
- **Neutral** — Clean Off-White page background with Clean White cards, so content stays readable.

| Token | Role | Colors |
| --- | --- | --- |
| `--navy-900` / `--navy-800` | **Deep Sapphire** — nav bar, footer, headings, primary buttons | `#0A192F` / `#12294A` |
| `--navy-700` / `--navy-100` / `--navy-50` | **Sapphire tints** — prices, muted surfaces, toggles | `#1B3A63` / `#E4EAF2` / `#F1F5FA` |
| `--sky-500` | **Sky Blue** — icons, active nav underline, decorative fills | `#00A4E4` |
| `--sky-700` / `--sky-600` | **Deep Sky** — link text, borders, hover states | `#0072AC` / `#0087BE` |
| `--sky-100` / `--sky-50` | **Sky tints** — soft info backgrounds | `#DCF0FB` / `#F0F9FE` |
| `--coral-500` | **Sunset Coral** — primary CTA fill (white text) | `#FF5A5F` |
| `--coral-700` / `--coral-600` | **Deep Coral** — CTA border/hover, cart badge, saved state | `#C42B31` / `#F0444A` |
| `--marigold-500` | **Marigold** — stars, filters, badges, loyalty, "Add to cart" | `#FFB81C` |
| `--marigold-600` / `--marigold-100` / `--marigold-50` | **Marigold shades** — borders, tints | `#C98A00` / `#FFF0CC` / `#FFF8E7` |
| `--bg` / `--white` | **Clean Off-White / Clean White** — page and card surfaces | `#F8FAFC` / `#FFFFFF` |
| `--ink` / `--ink-soft` / `--line` | **Sapphire ink** — body text, secondary text, borders | `#1C2B41` / `#51627C` / `#E2E8F0` |
| `--success` / `--danger` | **Semantic only** — done/success and destructive states (not brand) | `#0E7C5A` / `#B3261E` |

**Accessibility (WCAG AA)** — contrast ratios were computed with the standard WCAG relative-luminance formula, not eyeballed:

| Pair | Ratio | Note |
| --- | --- | --- |
| Deep Sapphire `#0A192F` on white | **17.6:1** | AAA — nav bar, footer, headings |
| Body ink `#1C2B41` on Off-White `#F8FAFC` | **13.6:1** | AAA — body copy |
| Muted ink `#51627C` on Off-White | **5.9:1** | AA — secondary text |
| Link `#0072AC` on white | **5.25:1** | AA — link text |
| Navy `#0A192F` on Marigold `#FFB81C` | **10.2:1** | AAA — marigold never carries white text |
| Deep Coral `#C42B31` on white | **5.6:1** | AA — cart badge |
| Success `#0E7C5A` on white | **5.2:1** | AA — done/success |

Two deliberate choices keep the scheme accessible: **Sky Blue `#00A4E4` is only 2.83:1 on white**, so it is restricted to icons, active underlines and decorative fills — link text uses the darker `#0072AC` instead. And **Sunset Coral `#FF5A5F` is 3.05:1 with white text**, which clears AA for large/bold UI elements but not body copy, so it is used only on bold button labels and paired with a deeper coral border for edge definition.

**Colour discipline** — coral no longer appears on the booking funnel at all. Because `#FF5A5F` sits in the same hue family as error red, a coral *Confirm & book* can read as "stop / something is wrong" at the exact moment a customer commits money, so the whole funnel (login *Continue*, *Book now*, *Checkout*, *Continue to review*, *Confirm & book*) uses `.btn-go` — a Deep Sapphire gradient that lifts label contrast from 3.05:1 to 11.5–17.6:1 and signals trust and forward motion. Coral survives only on `.btn-ghost.is-saved`, `.badge` and `.detail-cover .price-line`, where it is warm emphasis rather than a decision. Marigold covers filters, stars, badges, loyalty and secondary buttons.

Two further guardrails: destructive actions (`.btn-ghost.is-danger`, *Clear cart*, *Cancel booking*) use red rather than marigold so "delete" never reads cheerful, and completed checkout steps use semantic green so "done" never reads as another call to action.

**Travel-feel hero** — the Explore hero layers a warm **marigold sunrise glow**, soft ocean wake lines, a diagonal sun ray and a ✈ paper-plane watermark over the Deep Sapphire → ocean-blue gradient. Category cover gradients stay blue-dominant so blue keeps its ~90% share of the page.

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
