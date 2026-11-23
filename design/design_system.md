---
name: "Tawseel+ Design System"
description: "Mobile-first RTL Arabic design system for an Algerian Cash-on-Delivery (COD) merchant platform with forest emerald (#2c6e49) and fresh mint (#52b788) tones on clean rounded cards."
---

## Overview

Tawseel+ (توصيل بلس) is a mobile-first Cash-on-Delivery (COD) operations and checkout platform built for Algerian e-commerce merchants. The interface balances everyday operational clarity with trustworthy financial precision: merchants track shipments across all 58 wilayas, confirm COD orders by phone, and share frictionless mobile checkout links with buyers.

The visual language is **Corporate / Modern** with **Minimalist** breathing room: crisp off-white surfaces, generous rounded cards (`16px`–`24px`), clear Arabic typographic hierarchy, and purposeful emerald green accents that signal confirmed deliveries and collected cash without visual clutter.

- **Directionality:** Strictly right-to-left (`dir="rtl"`, `lang="ar"`) across all screens, navigation, tables, and form controls.
- **Theme Polarity:** Light mode by default for high legibility in bright retail and warehouse environments.

## Colors

The palette preserves the brand's **Forest Emerald** primary (`#2c6e49`) and **Fresh Mint** accent (`#52b788`), supported by warm-neutral green-tinted surfaces derived from the same hue family.

- **Primary (`#2c6e49`):** Anchors primary actions, active navigation states, and brand trust marks. Paired with crisp white (`#FFFFFF`) text.
- **Accent (`#52b788`):** Highlights positive delivery momentum, active status indicators, and key conversion badges. Paired with deep forest (`#002113`) text for accessible contrast.
- **Semantic Status:** Reserved strictly for order states (Delivered, Pending Confirmation, In Transit, Returned/Cancelled). Never used decoratively.

```yaml
colors:
  primary: "#2c6e49"
  on-primary: "#FFFFFF"
  primary-container: "#ADF2C3"
  on-primary-container: "#002110"
  accent: "#52b788"
  on-accent: "#002113"
  accent-container: "#BFFFDA"
  on-accent-container: "#002113"
  surface: "#FAFDF7"
  surface-container-lowest: "#FFFFFF"
  surface-container-low: "#EFF2EC"
  surface-container: "#E1E3DE"
  on-surface: "#191C19"
  on-surface-variant: "#404942"
  outline: "#707971"
  outline-variant: "#DBE5DB"
  success: "#286A46"
  on-success: "#FFFFFF"
  success-container: "#C1FFD4"
  on-success-container: "#002110"
  warning: "#8C5000"
  on-warning: "#FFFFFF"
  warning-container: "#FFDCBA"
  on-warning-container: "#2D1600"
  error: "#BA1A1A"
  on-error: "#FFFFFF"
  error-container: "#FFDAD6"
  on-error-container: "#410002"
```

## Typography

All Arabic copy uses **Cairo** for headlines and numeric KPIs (clean geometric strokes that stay sharp at bold weights) paired with **Tajawal** for body copy, table cells, and form labels (open counters and high legibility at small mobile sizes). **Red Hat Mono** handles order codes, tracking IDs, and phone numbers with `tabular-nums`.

```yaml
typography:
  display-lg:
    fontFamily: "Cairo"
    fontSize: 40px
    fontWeight: 800
    lineHeight: 48px
    letterSpacing: 0px
  display-lg-mobile:
    fontFamily: "Cairo"
    fontSize: 28px
    fontWeight: 800
    lineHeight: 36px
    letterSpacing: 0px
  headline-lg:
    fontFamily: "Cairo"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 42px
    letterSpacing: 0px
  headline-lg-mobile:
    fontFamily: "Cairo"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: 0px
  headline-md:
    fontFamily: "Cairo"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: 0px
  title-lg:
    fontFamily: "Cairo"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 26px
    letterSpacing: 0px
  title-md:
    fontFamily: "Tajawal"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Tajawal"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "Tajawal"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Cairo"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0px
  label-md:
    fontFamily: "Tajawal"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 16px
    letterSpacing: 0px
  label-sm:
    fontFamily: "Tajawal"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0px
  mono-md:
    fontFamily: "Red Hat Mono"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: 0px
```

## Layout & Spacing

The layout uses a **Mobile-First Fluid Grid** (`390px` baseline) with `16px` horizontal page margins and a strict `4px` / `8px` spacing scale. Cards stack in single-column or 2-column compact metric grids (`gap-3` / `12px` or `gap-4` / `16px`) and never nest more than two levels deep.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 12px
  gutter-lg: 16px
  gutter-xl: 24px
  section: 32px
  page-margin: 16px
```

## Elevation & Depth

Hierarchy is established primarily through **tonal surface layering** (`surface` `#FAFDF7` base with `surface-container-lowest` `#FFFFFF` cards) and crisp `1px` `outline-variant` (`#DBE5DB`) hairline borders. Primary floating action bars and sticky checkout summaries use a subtle, diffused emerald-tinted shadow (`0 8px 24px -4px rgba(25, 28, 25, 0.08)`). Backdrop blur and glassmorphism are not used.

## Shapes

Modern, friendly **rounded cards** define the silhouette. Outer cards use `16px` (`rounded-lg`) or `24px` (`rounded-xl`) corners, nested inner containers step down to `12px` (`rounded-md`), and interactive pills, status badges, and primary CTA buttons use `12px` (`rounded-md`) or full pills (`rounded-full`).

```yaml
rounded:
  sm: 8px
  DEFAULT: 12px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Motion is crisp and functional. Button presses and tab switches respond in `120ms`, while drawers and filter sheets decelerate smoothly over `220ms`. Only `transform`, `opacity`, and color properties animate.

```yaml
motion:
  state-change:
    duration: 120ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 220ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Tone of voice:** Direct, reassuring, and merchant-friendly Modern Standard Arabic with familiar Algerian e-commerce terms (الولاية، البلدية، الدفع عند الاستلام، تأكيد الطلب، دج).
- **Terminology:** Always use **دج** (Algerian Dinar) for currency (`4,500 دج`), **الولاية** for province (e.g., `16 - الجزائر`, `31 - وهران`, `25 - قسنطينة`), and **الدفع عند الاستلام** for COD.
- **Action labels:** Use clear verb phrases naming the outcome (`تأكيد الطلب الآن`, `أضف طلبًا جديدًا`, `تصفية حسب الولاية`), never generic labels like `موافق` or `إرسال`.
- **Numbers & dates:** Use Western Arabic numerals (`0-9`) with `tabular-nums` for prices, phone numbers, and order IDs so Algerian merchants and couriers can scan digits instantly.

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Input Field** → `@components/input-field.html`: `input-field-text`, `input-field-icon`
- **Table** → `@components/table.html`: `table-standard`, `table-interactive`, `table-selectable`
