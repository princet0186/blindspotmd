---
name: Premium Utility Clinical Interface
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for **BlindSpotMD**, a high-stakes clinical diagnostic tool for rural practitioners. The brand personality is **Authoritative, Stoic, and Indispensable**. It rejects the "magic" of AI in favor of "Clinical Precision"—the interface should feel like a high-end medical instrument rather than a consumer app.

The design style is **Corporate Modern with a Utility focus**. It leverages a structured, card-based architecture inspired by functional laboratory software. It prioritizes information density and legibility over decorative flourishes, ensuring doctors can extract life-saving insights from patient records within seconds, even on mid-range hardware common in rural clinics.

**Key Principles:**
- **Zero Distraction:** No animations or transitions that delay data delivery.
- **High Information Density:** Systematic layout that maximizes "above-the-fold" clinical data.
- **Visual Stability:** Predictable placement of alerts and navigation to build muscle memory.

## Colors
The palette is rooted in **Deep Clinical Blues** and **Neutral Slates** to evoke trust and reduce optical fatigue during extended diagnostic sessions. 

- **Primary (Slate 900):** Used for primary headings and navigation backgrounds. Represents the "Ground Truth."
- **Secondary (Blue 600):** Used for interactive elements and primary actions. Highly visible but professional.
- **Surface (Neutral 50):** An off-white base that prevents the harsh glare of pure white (#FFFFFF) on mobile screens.
- **Semantic Accents:** 
    - **Alert Red:** Reserved strictly for critical "Blind Spots" or life-threatening vitals.
    - **Soft Amber:** Used for borderline cases or data discrepancies.
    - **Success Green:** Indicates verified data or completed diagnoses.

## Typography
The system uses **Public Sans** for structural elements and **Inter** for data. This combination balances the institutional authority of a government-grade typeface with the technical precision of a screen-optimized sans-serif.

- **Data-Mono Treatment:** While Inter is used, clinical values (BP, Heart Rate, SpO2) should use a medium/semibold weight to ensure they stand out from descriptive text.
- **Scale:** The scale is slightly larger than standard SaaS to account for the varied lighting conditions and device qualities found in rural environments.
- **Hierarchy:** Use `label-sm` in Slate 500 for metadata (e.g., "Last Updated") to keep the primary focus on the clinical values.

## Layout & Spacing
This design system employs a **Fixed-Fluid Hybrid Grid**. Content is housed in a 12-column grid on desktop, collapsing to a single column on mobile.

- **Spacing Rhythm:** Based on a 4px baseline. Most components use `16px (md)` padding to ensure touch targets remain accessible (minimum 44x44px) for doctors on tablet or mobile devices.
- **Card-Based Architecture:** Every patient metric or AI insight is encapsulated in a card. This allows for a modular layout that can reflow based on screen width without losing contextual grouping.
- **Sidebar:** A persistent 280px sidebar on desktop provides immediate access to the Patient Queue and Emergency Alerts. On mobile, this transitions to a bottom navigation bar for ergonomic thumb reach.

## Elevation & Depth
Elevation in the design system is used to indicate **Contextual Importance** rather than physical realism.

- **Surface Layers:** The main background is `Neutral 50`. Primary cards sit on `White (#FFFFFF)` with a `1px` border of `Slate 200`.
- **Subtle Shadows:** Instead of heavy blurs, we use a single, crisp "Low Contrast" shadow (0px 1px 3px rgba(0,0,0,0.1)) to lift active cards.
- **Alert Elevation:** Critical "Blind Spot" cards use a slightly thicker 2px left-border of `Alert Red` to draw the eye horizontally through the layout, bypassing the standard hierarchy.
- **Empty States:** Use dashed borders in `Slate 300` for empty data slots to indicate they are "awaiting input" rather than "missing data."

## Shapes
The system uses **Soft (0.25rem)** roundedness. This provides a professional, modern feel that is less aggressive than sharp corners but more serious than highly rounded "bubbly" interfaces.

- **Buttons:** Use `rounded-md` (0.375rem) to distinguish interactive elements from static cards.
- **Status Pills:** Use a full `pill` (999px) radius to differentiate them from data-entry fields or containers.
- **Input Fields:** Use 4px corner radius to maintain a technical, form-based appearance.

## Components
- **Primary Buttons:** Solid `Slate 900` with white text. High contrast for "Confirm Diagnosis" or "Save Record."
- **Clinical Cards:** White background, 1px `Slate 200` border. Headers should include a `label-sm` title and a `headline-sm` value.
- **Blind Spot Alerts:** A specialized card component with a `Red 50` background and `Red 600` text for the insight, designed to break the "Premium Utility" pattern to force attention.
- **Data Lists:** Zebra-striping with `Neutral 50` for multi-row patient vitals to assist horizontal eye-tracking.
- **Input Fields:** Thick 1px borders in `Slate 300`. On focus, the border shifts to `Blue 600` with a subtle 2px glow of the same color.
- **Status Chips:** Small, low-saturation backgrounds (e.g., `Blue 50`) with high-saturation text (e.g., `Blue 700`) for categorizing patient status (e.g., "Stable", "In-Review").