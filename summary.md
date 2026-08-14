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

## 4. UI Color System — "High-Trust Booking"

The UI was designed to **project stability and security** (critical for payment/booking flows) while remaining clean and readable. The entire palette is controlled by CSS variables in `css/style.css` → `:root`, so the whole site can be re-themed from one place.

### Color roles & tokens
| Token | Role | Color |
| --- | --- | --- |
| `--teal-900` | **Deep Navy** — deepest structural tone (brand, hero, shadows) | `#0F172A` |
| `--teal-800` | **Deep Navy blue** — secondary structural tone (login card, prices) | `#1E3A8A` |
| `--teal-700` | **Professional Teal (deep)** — CTA surfaces, links, active states | `#0F766E` |
| `--teal-600` | **Professional Teal** — decorative borders, gradients, large elements | `#0D9488` |
| `--teal-500` | **Teal (bright)** — focus borders, hover accents, loyalty fill | `#14B8A6` |
| `--teal-100` / `--teal-50` | **Teal tints** — soft backgrounds, pills, selected states | `#CCFBF1` / `#F0FDFA` |
| `--sand` | **Soft Gray** — page background | `#F8FAFC` |
| `--white` | **Clean White** — cards, forms, modals | `#FFFFFF` |
| `--ink` | **Slate Charcoal** — body text | `#334155` |
| `--ink-soft` | **Slate Gray** — secondary text / muted | `#64748B` |
| `--line` | **Border gray** | `#E2E8F0` |
| `--danger` | **Semantic error/red** | `#DC2626` |
| `--success` | **Semantic success/green** | `#16A34A` |
| `--coral` / `--gold` | **Teal accent (was warm gold in earlier iteration)** | `#0F766E` `#115E59` |

### WCAG AA contrast strategy
- **CTA surfaces** (primary/accent buttons, active nav, chips, step dots) use **`#0F766E`** → **~5.5:1** against white — passes AA for normal-size text.
- **Links** use `#0F766E` for the same reason.
- **`#0D9488` (3.75:1)** is used only for decorative borders, gradients, radio selection outlines, and large graphic elements — not normal-size text.
- **Body text** is Slate Charcoal `#334155` on white → **~9.8:1**.

### Brand gradients
| Gradient | Used for | Colors |
| --- | --- | --- |
| `--grad-hero` | Hero, login backdrop, loyalty card, avatar, brand mark | `#0F172A → #1E3A8A → #0D9488` |
| `--grad-beach` | Beach category covers | `#14B8A6 → #0F766E` |
| `--grad-mountain` | Mountain covers | `#0F766E → #1E3A8A` |
| `--grad-city` | City covers | `#1E3A8A → #0F172A` |
| `--grad-cultural` | Cultural covers | `#0D9488 → #0F172A` |
| `--grad-adventure` | Adventure covers | `#16A34A → #0F766E` |
| `--grad-wildlife` | Wildlife covers | `#0F766E → #0F172A` |

---

## 5. Travel-Feel Hero

The Explore page hero layers a travel atmosphere over the Deep Navy → Navy → Teal gradient:

1. **Teal sunrise glow** — radial teal light (`#14B8A6`) in the top-right, like sun over the ocean
2. **Ocean wake lines** — three soft rippling lines across the lower third (foam + deep navy water shadow)
3. **Diagonal sun ray** — a translucent light streak sweeping across the banner
4. **✈ Paper-plane watermark** — large rotated plane icon top-right with a navy drop shadow

---

## 6. Design principles

- **Trust first** — booking/payment flows use deep, stable navy + teal; no alarming colors
- **Calm surfaces** — soft-gray backgrounds with clean white cards reduce visual noise
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