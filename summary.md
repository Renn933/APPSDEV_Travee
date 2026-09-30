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

## 4. UI Color System — "Coastal High-Trust"

The UI **projects stability and security** (critical for payment/booking flows) while staying clean and readable. It follows the **60 / 30 / 10 rule** so neutrals dominate, ocean blue frames the structure, and a single accent marks the calls-to-action. The entire palette is controlled by CSS variables in `css/style.css` → `:root`, so the whole site can be re-themed from one place.

### 60 / 30 / 10 allocation
| Band | Share | Used for |
| --- | --- | --- |
| **Dominant neutrals** | ~60% | Page background (Soft Sand/Cream), cards, forms, modals, panels, footer (Clean White) |
| **Secondary tone** | ~30% | Header, hero + category gradients, loyalty card, login backdrop, brand mark, links, active nav, prices, step dots (Deep Ocean Blue) |
| **Accent (CTAs only)** | ~10% | Primary calls-to-action — "Add to cart", "Book now", "Checkout", "Continue", "Confirm & book" — plus the cart count badge (Bright Aqua) |

### Color roles & tokens
| Token | Band | Role | Color |
| --- | --- | --- | --- |
| `--sand` | 60% | **Soft Sand / Cream** — page background | `#F2E9D8` |
| `--white` | 60% | **Clean White** — cards, forms, modals | `#FFFFFF` |
| `--teal-900` | 30% | **Deep Ocean Blue (deepest)** — brand, hero, shadows | `#06343A` |
| `--teal-800` | 30% | **Deep Ocean Blue (deep)** — secondary structural tone (login card, prices) | `#08454C` |
| `--teal-700` | 30% | **Deep Ocean Blue** — secondary actions, links, active states | `#0B5D67` |
| `--teal-600` | 30% | **Deep Ocean Blue (bright)** — borders, gradients, focus outlines | `#0E7B87` |
| `--teal-100` / `--teal-50` | 30% | **Aqua tints** — soft backgrounds, pills, selected states | `#D7ECE6` / `#EEF7F4` |
| `--accent` / `--accent-dark` | **10%** | **Bright Aqua accent (CTA only)** — dark ocean text sits on the aqua fill | `#8FD6C8` / `#5CC3AE` |
| `--accent-soft` | 10% | **Accent tint** — subtle accent-tinted backgrounds | `#E2F4EF` |
| `--ink` | — | **Deep Slate-Teal** — body text | `#2B3A37` |
| `--ink-soft` | — | **Muted Slate-Teal** — secondary text / muted | `#566661` |
| `--line` | — | **Warm sand border** | `#E7DDCA` |
| `--danger` | — | **Semantic error/red** | `#DC2626` |
| `--success` | — | **Semantic success/green** | `#16A34A` |

### WCAG AA contrast strategy
- **Secondary actions / links** use ocean `#0B5D67` → **~7.6:1** against white — passes AA (and AAA) for normal-size text.
- **CTA buttons** pair the light aqua fill `#8FD6C8` with **dark ocean text `#06343A`** → **~8:1** (aqua itself is only ~1.7:1 against white, so it is never used behind white text) plus a `#0E7B87` border for edge definition.
- **`#0E7B87` (~5.0:1)** is used for decorative borders, gradients, focus outlines and large graphic elements.
- **Body text** is Deep Slate-Teal `#2B3A37` on white → **~11.9:1** (and ~9.9:1 on the sand background).

### Brand gradients
| Gradient | Used for | Colors |
| --- | --- | --- |
| `--grad-hero` | Hero, login backdrop, loyalty card, avatar, brand mark | `#06343A → #0B5D67 → #0E7B87` |
| `--grad-beach` | Beach category covers | `#8FD6C8 → #0B5D67` |
| `--grad-mountain` | Mountain covers | `#0E7B87 → #06343A` |
| `--grad-city` | City covers | `#0B5D67 → #06343A` |
| `--grad-cultural` | Cultural covers | `#08454C → #0E7B87` |
| `--grad-adventure` | Adventure covers | `#2FAE9E → #0B5D67` |
| `--grad-wildlife` | Wildlife covers | `#06343A → #08454C` |

---

## 5. Travel-Feel Hero

The Explore page hero layers a travel atmosphere over the Deep Ocean → Ocean gradient:

1. **Aqua sunrise glow** — radial aqua light (`#8FD6C8`) in the top-right, like sun over the ocean
2. **Ocean wake lines** — three soft rippling lines across the lower third (foam + deep ocean water shadow)
3. **Diagonal sun ray** — a translucent light streak sweeping across the banner
4. **✈ Paper-plane watermark** — large rotated plane icon top-right with a deep-ocean drop shadow

---

## 6. Design principles

- **Trust first** — booking/payment flows use deep, stable ocean blue; no alarming colors
- **60/30/10 discipline** — neutrals dominate (60%), ocean blue frames the structure (30%), bright aqua is reserved for CTAs (10%)
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