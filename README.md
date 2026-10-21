# Keyscale

> **Compare Computer Keyboards at the Same Scale**  
> An independent physical keyboard comparison and specification research platform inspired by the interaction quality and usability of [EloShapes](https://www.eloshapes.com).

[![Keyscale CI](https://github.com/mostafaaym-creator/keyscale/actions/workflows/ci.yml/badge.svg)](https://github.com/mostafaaym-creator/keyscale/actions/workflows/ci.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-emerald.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-orange.svg)](https://workers.cloudflare.com/)

---

## 1. Overview & Core Features

Keyscale enables users to understand physical computer keyboard differences in exact millimeter-scaled dimensions, analyze desk footprint, and inspect hardware specifications backed by verifiable primary evidence.

### Key Capabilities
* **Interactive Multi-Keyboard Comparison (`/compare`)**: Compare 2 to 6+ keyboards simultaneously.
  * **Overlay Mode**: Scaled millimeter SVG coordinate canvas with adjustable fill opacity (10–100%), 6 alignment anchors (`center`, `left`, `right`, `top`, `bottom`, `front`), measurement rulers, and 10mm/50mm reference grids.
  * **Side-by-Side Mode**: Proportional horizontal view across all keyboards on a shared physical scale.
  * **3D Volume View**: Three.js WebGL volume visualization with lighting, mouse rotation, and accessible 2D fallback.
  * **Specification Difference Matrix**: Compare width, depth, height, weight, and desk footprint with automatic deltas relative to a selected reference model.
  * **Shareable Comparisons**: URL state synchronization restoring selected models, view modes, alignments, and custom dimensions.
* **Comprehensive Keyboard Database (`/keyboards`)**: 622 cataloged and deduplicated models across 41 manufacturers.
  * Fast debounced search matching brands, models, families, and common abbreviations (e.g., TKL / Tenkeyless).
  * Faceted filtering by layout form-factor (100%, TKL, 75%, 65%, 60%), connectivity (Wired, 2.4GHz, Bluetooth), switch technology (Mechanical, Magnetic / Hall Effect, Optical, Membrane), verification state, and retail availability.
* **Dedicated Product Detail Pages (`/keyboards/:id`)**:
  * Physical dimensions, weight, and technical specifications.
  * Traceable Tier 1–5 primary evidence citations, check dates, and reviewer quotes.
  * Real retailer pricing observations in USD ($), SAR (ر.س), EGP, GBP (£), and EUR (€).
* **Find Similar Recommendation Engine (`/find-similar`)**: Deterministic weighted similarity algorithm prioritizing physical chassis dimensions, desk footprint, layout, and switch technology with explainable score breakdowns.
* **Interactive Desk Space Visualizer (`/desk`)**:
  * Custom desk sizing (1200×600 to 1800×800 mm).
  * Drag and rotate (+90°) keyboards on the desk surface.
  * Real-time collision / overlap detection.
  * Available desk work area percentage calculations.
* **Custom Keyboard Modeler (`/custom`)**: Add custom caliper measurements to compare against production models.
* **Full Multilingual Support**: English (LTR) and Arabic (RTL) with localized interfaces and number formatting.
* **Evidence Hierarchy & Audit Trail (`/sources`)**: Five-tier evidence classification tracking primary manufacturer documentation down to unverified community claims.

---

## 2. Design System Tokens (Preserved Brand Identity)

Keyscale preserves the established brand identity with full dark and light mode support:

### Light Theme
| Token | Hex Value | Description |
|---|---|---|
| Main Background | `#f7f8fa` | Canvas and page background |
| Main Text | `#20252c` | High contrast primary text |
| Cards / Panels | `#ffffff` | Elevated surfaces and dropdowns |
| Primary Green | `#137b65` | Brand accents and primary actions |
| Comparison Green (Slot A) | `#127c68` | Slot A silhouette and tone |
| Comparison Purple (Slot B) | `#6a66c9` | Slot B silhouette and tone |
| Subtle Borders | `#e1e5e9` | Grid lines and panel dividers |
| Muted Text | `#666d79` | Secondary labels and metadata |
| Accent Background | `#e8f3ef` | Soft badge and selection tints |

### Dark Theme
| Token | Hex Value | Description |
|---|---|---|
| Main Background | `#11161c` | Deep dark page canvas |
| Main Text | `#eef2f6` | High contrast light text |
| Cards / Panels | `#192029` | Dark elevated card surfaces |
| Primary Green | `#64d7b5` | Vibrant brand green |
| Comparison Green (Slot A) | `#56d9b8` | Slot A neon mint |
| Comparison Purple (Slot B) | `#b0a3ff` | Slot B lavender purple |
| Subtle Borders | `#303b47` | Crisp panel divider lines |

---

## 3. Technology Stack

* **Frontend**: React 19, TypeScript 5.7, Vite 6, Tailwind CSS v4, Lucide React, Three.js
* **Routing**: React Router v7 with route-level code splitting (`React.lazy`)
* **Testing**: Vitest (Automated unit, similarity, geometry, pricing, and URL state tests)
* **Infrastructure**: Cloudflare Workers with Static Assets, Cloudflare D1 (`keyscale-db`)
* **Configuration**: `wrangler.jsonc`

---

## 4. Local Development

### Prerequisites
* Node.js `>= 20.0.0`
* npm `>= 10.0.0`

### Installation
```bash
git clone https://github.com/mostafaaym-creator/keyscale.git
cd keyscale
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Run Tests
```bash
npm test
```
Executes all 26 automated unit and integration tests using Vitest.

### Production Build
```bash
npm run build
```
Typechecks with `tsc -b` and builds production assets to `./dist`.

---

## 5. Cloudflare Workers Deployment

Keyscale is configured for deployment to Cloudflare Workers with Static Assets and Cloudflare D1:

1. **Verify Cloudflare credentials:**
   ```bash
   npx wrangler whoami
   ```
2. **Apply D1 Database Migrations:**
   ```bash
   npx wrangler d1 migrations apply keyscale-db --local
   # For remote: npx wrangler d1 migrations apply keyscale-db --remote
   ```
3. **Deploy Preview / Production:**
   ```bash
   npm run deploy
   ```

---

## 6. Verification & Evidence Hierarchy

We never fabricate specifications. Specifications are categorized across 5 distinct tiers:
* **Tier 1 — Primary Manufacturer**: Official specification sheets, product pages, PDF manuals.
* **Tier 2 — Independent Testing**: Hardware review labs using precision digital calipers.
* **Tier 3 — Authorized Retailers**: Amazon, Best Buy, Newegg, Micro Center SKU listings.
* **Tier 4 — Secondary Technical**: Video reviews showing caliper measurements on camera.
* **Tier 5 — Unverified**: Community forum claims. Never presented as confirmed facts.

---

## 7. License & Disclaimers

All product names, trademarks, and registered trademarks belong to their respective manufacturers. Keyscale is an independent comparison and research platform.

Licensed under the [ISC License](LICENSE).
