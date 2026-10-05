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
| `#/login` | Sign in / Create profile | Two separate demo-auth forms (localStorage) |
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

## 4. UI Color System — Split-complementary (Blue · Coral · Marigold)

The UI **projects stability and security** (critical for payment/booking flows) while staying clean and readable. It uses a **split-complementary** scheme built on **blue**: one dominant hue plus the two hues that flank its direct opposite. Blue owns roughly **90% of the visual space** to establish trust; the two warm hues share about **10%** and appear **only on action items and important details**, never on large surfaces. The entire palette is controlled by CSS variables in `css/style.css` → `:root`, so the whole site can be re-themed from one place.

### Blue-dominant, warm-accent rationing
| Band | Share | Used for |
| --- | --- | --- |
| **Blue family** | ~90% | Page background (Clean Off-White), cards, forms, modals, nav bar, footer, headings, links, primary buttons, prices, active nav, focus rings, all cover gradients |
| **Sunset Coral** | ~5% | Primary CTAs (*Book now*, *Checkout*, *Confirm & book*), cart count badge, saved-wishlist state, detail price pill |
| **Marigold** | ~5% | Rating stars, active filter chips, category tags, loyalty points & progress bar, promo/deal badges, secondary buttons |

### Color roles & tokens
| Token | Role | Color |
| --- | --- | --- |
| `--navy-900` | **Deep Sapphire** — nav bar, footer, headings, structure | `#0A192F` |
| `--navy-800` | **Sapphire** — primary buttons, prices, emphasis | `#12294A` |
| `--navy-700` / `--navy-100` / `--navy-50` | **Sapphire tints** — totals, muted surfaces, toggles | `#1B3A63` / `#E4EAF2` / `#F1F5FA` |
| `--sky-500` | **Sky Blue** — icons, active nav underline, decorative fills | `#00A4E4` |
| `--sky-700` / `--sky-600` | **Deep Sky** — link text, borders, hover | `#0072AC` / `#0087BE` |
| `--sky-100` / `--sky-50` | **Sky tints** — soft info backgrounds | `#DCF0FB` / `#F0F9FE` |
| `--coral-500` | **Sunset Coral** — primary CTA fill (white text) | `#FF5A5F` |
| `--coral-700` / `--coral-600` | **Deep Coral** — CTA border & hover, cart badge, saved state | `#C42B31` / `#F0444A` |
| `--marigold-500` | **Marigold** — stars, filters, badges, loyalty, secondary CTAs | `#FFB81C` |
| `--marigold-600` / `--marigold-100` / `--marigold-50` | **Marigold shades** — borders, tints | `#C98A00` / `#FFF0CC` / `#FFF8E7` |
| `--bg` | **Clean Off-White** — page background | `#F8FAFC` |
| `--white` | **Clean White** — cards, forms, modals | `#FFFFFF` |
| `--ink` | **Sapphire ink** — body text | `#1C2B41` |
| `--ink-soft` | **Muted sapphire** — secondary text | `#51627C` |
| `--line` | **Cool border** | `#E2E8F0` |
| `--success` | **Semantic success** (not brand) — done/success | `#0E7C5A` |
| `--danger` | **Semantic destructive** (not brand) | `#B3261E` |

### WCAG AA contrast strategy
Ratios below were computed with the WCAG relative-luminance formula, not estimated:

- **Deep Sapphire `#0A192F` on white → 17.6:1** (AAA) — carries the nav bar, footer and every heading.
- **Body ink `#1C2B41` on Clean Off-White `#F8FAFC` → 13.6:1** (AAA); muted ink `#51627C` → **5.9:1** (AA).
- **Links** use Deep Sky `#0072AC` → **5.25:1** (AA). Sky Blue `#00A4E4` is only 2.83:1 on white, so it is **restricted to icons, active underlines and decorative fills**, never link text.
- **Primary CTAs** pair Sunset Coral `#FF5A5F` with white text (3.05:1 — passes AA for large/bold UI elements, not body copy) plus a Deep Coral `#C42B31` border for edge definition; hover darkens to `#F0444A` (3.73:1).
- **Marigold never carries white text** — navy `#0A192F` on `#FFB81C` is **10.2:1** (AAA).
- **Cart badge** uses Deep Coral `#C42B31` → **5.6:1** (AA) so the tiny white numeral stays legible.
- **Semantic success** `#0E7C5A` → **5.2:1** (AA); **destructive** `#B3261E` → **6.5:1** (AA).

**Colour discipline rules**
- Coral is confined to `.btn-accent`, `.btn-ghost.is-saved`, `.badge` and `.detail-cover .price-line` — the ultimate actions plus the cart count.
- Destructive actions (*Clear cart*, *Cancel booking*) use red via `.btn-ghost.is-danger`, never marigold, so "delete" never reads cheerful.
- Completed checkout steps use semantic green so "done" never reads as another call to action.

### Brand gradients
| Gradient | Used for | Colors |
| --- | --- | --- |
| `--grad-hero` | Hero, login backdrop, loyalty card, avatar, brand mark | `#0A192F → #123A63 → #0E6FA8` |
| `--grad-beach` | Beach category covers | `#0087BE → #00A4E4` |
| `--grad-mountain` | Mountain covers | `#0A192F → #24507F` |
| `--grad-city` | City covers | `#12294A → #0087BE` |
| `--grad-cultural` | Cultural covers | `#1B3A63 → #00A4E4` |
| `--grad-adventure` | Adventure covers | `#0A192F → #0072AC` |
| `--grad-wildlife` | Wildlife covers | `#0E6FA8 → #1B3A63` |

All cover gradients stay blue-dominant so the warm hues never take over a screen.

---

## 5. Travel-Feel Hero

The Explore page hero layers a travel atmosphere over the Deep Sapphire → ocean-blue gradient:

1. **Marigold sunrise glow** — radial warm light (`#FFB81C` at low opacity) in the top-right, like sun over the ocean
2. **Ocean wake lines** — three soft rippling lines across the lower third (foam + deep-blue water shadow)
3. **Diagonal sun ray** — a translucent light streak sweeping across the banner
4. **✈ Paper-plane watermark** — large rotated plane icon top-right with a deep-blue drop shadow

---

## 6. Design principles

- **Trust first** — booking/payment flows use deep, stable sapphire blue; no alarming colors
- **Blue-dominant split-complementary** — blue covers ~90% of the UI while coral (~5%) and marigold (~5%) are rationed to CTAs, filters and detail highlights
- **Calm surfaces** — clean off-white background with white cards reduce visual noise
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