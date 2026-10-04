# ✈ Travee — Project Summary

A high-level overview of the Travee flight booking website: the concept, the plan that drove it, the architecture, and the UI color system.

---

## 1. Concept

**Travee** is a **flight booking web app** for:
- **Domestic routes** across the Philippines
- **International routes** from Manila (MNL)

It is built with **vanilla HTML, CSS, and JavaScript** — no server, no database, no framework, and no build step. Everything runs entirely in the browser and persists user data via **localStorage**.

**Core pitch:** *Book flights across the Philippines and around the world — compare fares, pick a class, and book your seat in minutes.*

---

## 2. Plan & Requirements (from `plan.md`)

### Mandatory requirements met
| Requirement | How Travee satisfies it |
| --- | --- |
| **5+ distinct screens/views** | 8 hash-routed SPA views (not sections of one page) |
| **3+ stateful features** | Cart, loyalty points, wishlist, filters, booking history |
| **Data-driven rendering** | All content lives in `js/data.js`; views are generated from it |
| **Responsive design** | Mobile-first breakpoints at 900px and 640px |
| **Polish** | Empty states, validation, confirmations, loaders, transitions, consistent design system |

### Allowed tooling
- ✅ Vanilla HTML, CSS, JavaScript
- ✅ localStorage for persistence
- ✅ Hardcoded JS/JSON data files
- ❌ No backend / API / real database
- ❌ No npm packages, build step, or dev server required
- ❌ No frameworks, icon libraries, or CSS frameworks

### Screens (hash routes)
| Route | Screen | Purpose |
| --- | --- | --- |
| `#/login` | Login / Register | Demo auth (localStorage) |
| `#/` | Explore | Hero, search, filters, sortable flight grid |
| `#/destination/:id` | Flight Detail | Class picker, travelers, date, add to cart |
| `#/cart` | Cart | Traveler steppers, promo codes, summary |
| `#/checkout` | Checkout | 2-step info → review & confirm |
| `#/confirmation/:id` | Confirmation | Receipt + loyalty points earned |
| `#/wishlist` | Saved Flights | Wishlist with quick actions |
| `#/profile` | Profile | Account, loyalty tier, booking history |

### Stateful features
- **Cart** — add/remove flights, traveler counts, persist to localStorage
- **Loyalty points** — earn per booking, tier system (Explorer → Legend), cancel deducts
- **Wishlist** — save/unsave routes
- **Filters** — search, Domestic/International scope, category chips, sort, price cap
- **Bookings** — multi-step checkout creates persistent booking history

### Demo data
- Routes carry fare (₱), flight time, airline, rating, and a local photo
- Regions/categories: Beach, Mountain, City, Cultural, Adventure, Wildlife
- Loyalty tiers and promo codes (`TRAVEE10` → 10% off, `EXPLORE50` → ₱50 off) are data-driven

---

## 3. Project Structure

```
index.html            App shell (header, footer, mount point)
css/style.css         Full design system (responsive, CSS variables)
images/               Destination photos (local, Wikimedia Commons)
js/data.js            All content as JS data
js/state.js           Single source of truth, persisted to localStorage
js/utils.js           Money/date/validation, toast, confirm modal, card markup
js/router.js          Hash router with auth guarding + chrome updates
js/views/             One file per screen
js/app.js             Bootstrap + global header actions
```

---

## 4. UI Color System — Balanced triadic (Blue · Rose · Green)

The UI **projects stability and security** (critical for payment/booking flows) while staying clean and readable. It uses a **balanced triadic** scheme — three hues spaced ~120° apart on the colour wheel: **Ocean Blue (≈206°)** (a recommended travel blue), **Rose (≈333°)** and **Fresh Green (≈88°)** — distributed **fairly** (no single dominant hue) over neutral sand/cream surfaces. The entire palette is controlled by CSS variables in `css/style.css` → `:root`, so the whole site can be re-themed from one place.

### Neutrals-led, evenly-spread triad
| Band | Share | Used for |
| --- | --- | --- |
| **Neutrals** | ~60% | Page background (Soft Sand/Cream), cards, forms, modals, panels, footer (Clean White) |
| **Ocean Blue (≈206°)** | ~13% | Links, primary buttons, active nav, prices, focus & active state, brand mark |
| **Rose (≈333°)** | ~13% | Primary CTAs, cart count badge, rating stars, wishlist-saved |
| **Fresh Green (≈88°)** | ~13% | Loyalty points, success/done steps, ghost buttons, category tags, coupons |

### Color roles & tokens
| Token | Hue | Role | Color |
| --- | --- | --- | --- |
| `--sand` | — | **Soft Sand / Cream** — page background | `#F2E9D8` |
| `--white` | — | **Clean White** — cards, forms, modals | `#FFFFFF` |
| `--blue-900` | ~206° | **Ocean Blue (deepest)** — brand, headings, hero, shadows | `#0A2E52` |
| `--blue-700` | ~206° | **Ocean Blue** — links, primary buttons, prices, active states | `#1560A0` |
| `--blue-600` | ~206° | **Ocean Blue (bright)** — borders, gradients, focus outlines | `#1E7FD1` |
| `--blue-100` / `--blue-50` | ~206° | **Blue tints** — soft backgrounds, pills | `#D5EBFB` / `#EEF6FD` |
| `--rose-700` / `--rose-600` | ~333° | **Rose** — CTA fill (white text) & saved/selected states | `#C81E5A` / `#E0407A` |
| `--rose-500` | ~333° | **Rose tint** — rating stars | `#F072A0` |
| `--green-800` / `--green-700` | ~88° | **Fresh Green** — points pill (white text), ghost button text | `#4A7A0A` / `#5C940D` |
| `--green-600` | ~88° | **Green (bright)** — borders, category tags, done steps | `#74B816` |
| `--ink` | — | **Deep Slate-Teal** — body text | `#2B3A37` |
| `--ink-soft` | — | **Muted Slate-Teal** — secondary text / muted | `#566661` |
| `--line` | — | **Warm sand border** | `#E7DDCA` |
| `--danger` | — | **Semantic error/red** | `#DC2626` |
| `--success` | — | **Semantic success/green** | `#16A34A` |

### WCAG AA contrast strategy
- **Links / primary actions** use ocean blue `#1560A0` → **~6.5:1** against white — passes AA.
- **CTA buttons** pair the deep rose fill `#C81E5A` with **white text** → **~5.5:1**, plus a matching `#C81E5A` border for edge definition.
- **Fresh Green** — `#4A7A0A` carries white text on the points pill (~5.2:1) and reads as dark text on the light-green tints; `#5C940D` / `#74B816` are reserved for borders and decorative fills.
- **Body text** is Deep Slate-Teal `#2B3A37` on white → **~11.9:1** (and ~9.9:1 on the sand background).

### Brand gradients
| Gradient | Used for | Colors |
| --- | --- | --- |
| `--grad-hero` | Hero, login backdrop, loyalty card, avatar, brand mark | `#0A2E52 → #1560A0 → #C81E5A` |
| `--grad-beach` | Beach category covers | `#1E7FD1 → #74B816` |
| `--grad-mountain` | Mountain covers | `#E0407A → #1560A0` |
| `--grad-city` | City covers | `#1560A0 → #C81E5A` |
| `--grad-cultural` | Cultural covers | `#74B816 → #1560A0` |
| `--grad-adventure` | Adventure covers | `#E0407A → #4A7A0A` |
| `--grad-wildlife` | Wildlife covers | `#74B816 → #E0407A` |

---

## 5. Travel-Feel Hero

The Explore page hero layers a travel atmosphere over the deep-blue → ocean → rose gradient:

1. **Rose sunrise glow** — radial rose light (`#F072A0`) in the top-right, like sun over the ocean
2. **Ocean wake lines** — three soft rippling lines across the lower third (foam + deep-blue water shadow)
3. **Diagonal sun ray** — a translucent light streak sweeping across the banner
4. **✈ Paper-plane watermark** — large rotated plane icon top-right with a deep-blue drop shadow

---

## 6. Design principles

- **Trust first** — booking/payment flows use deep, stable ocean blue; no alarming colors
- **Neutrals-led, balanced triad** — sand/cream + white carry ~60% of the UI, and the three triad hues (ocean blue, rose, green) are spread fairly (~13% each) with no single dominant color
- **Calm surfaces** — soft sand/cream backgrounds with clean white cards reduce visual noise
- **Accessible** — all normal-size text meets WCAG AA (see contrast strategy above)
- **One source of truth** — every color, radius, shadow and font is a CSS variable; re-theming is a one-line change
- **Consistent components** — shared buttons, cards, chips, forms, toasts, modals across all 8 screens

---

## 7. Run

```
# Option A — just open the file
open index.html            (macOS/Linux)
start index.html           (Windows)

# Option B — any static server
npx serve .
```

No install or build step required.