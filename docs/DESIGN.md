---
name: Eco-Corporate Synthesis
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
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#0058be'
  on-tertiary: '#ffffff'
  tertiary-container: '#2170e4'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  success-bg: '#dcfce7'
  success-text: '#15803d'
  warning-bg: '#fef3c7'
  warning-text: '#b45309'
  surface-border: '#f1f5f9'
  body-text: '#64748b'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.25'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system for this platform balances professional enterprise reliability with environmental stewardship. It is designed to bridge the gap between high-level governance (Monev) and grassroots community action. The aesthetic is **Corporate / Modern** with a strong leaning toward **Minimalism**, ensuring that the interface feels authoritative yet approachable for village administrators and local residents.

The visual narrative focuses on clarity, trust, and sustainability. By utilizing generous whitespace and a card-based architecture, the system minimizes cognitive load, allowing users to focus on critical environmental metrics and data tracking.

### Design Principles
- **Clarity over Decoration:** Every element serves a functional purpose in the monitoring process.
- **Environmental Trust:** Use of emerald tones to signify growth and ecological responsibility.
- **Accessibility:** High contrast for headings and large touch targets for mobile-first usage in rural settings.
- **Structural Integrity:** A clean, grid-based layout that reflects the organized nature of a successful waste management bank.

## Colors

The palette is anchored by **Emerald Green**, representing the core environmental mission. This is supported by a sophisticated **Dark Slate** for typography to maintain a corporate, professional edge.

- **Primary (Emerald 600):** Used for primary actions, active states, and key brand accents. It signals "go," "active," and "sustainable."
- **Secondary (Slate 900):** Reserved for high-level headings and navigation links to ensure a grounded, authoritative feel.
- **Tertiary (Blue 500):** Specifically used for informational statuses and system alerts to distinguish them from primary environmental actions.
- **Neutral (Slate 50):** The primary canvas color. It provides a soft, low-glare background that makes white content cards "pop."

### Semantic Usage
- **Success:** Green tones for completed transactions or achieved targets.
- **Warning:** Amber tones for pending tasks or capacity alerts.
- **Info:** Blue tones for general system updates or new indicators.

## Typography

This design system utilizes a dual-font strategy to balance character with utility. 

**Plus Jakarta Sans** is used for headlines. Its modern, slightly rounded geometric forms provide an optimistic and friendly tone suitable for community-led environmental initiatives. Use `font-extrabold` for primary hero sections to create a strong visual impact.

**Inter** is the workhorse for all functional text, including body copy, form labels, and data tables. It is chosen for its exceptional legibility at small sizes and high x-height, which is critical for administrators managing complex waste data on mobile devices.

### Scale & Hierarchy
- Use **Dark Slate (#0f172a)** for all headline levels to ensure maximum contrast.
- Use **Medium Slate (#64748b)** for body text to reduce eye strain during long reading sessions.
- In hero sections, apply the **Primary Emerald** color to keyword highlights within headlines to draw immediate attention to the value proposition.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a maximum container width to ensure readability on large monitors. The system emphasizes "breathing room" through generous vertical stacking and wide margins.

### Layout Model
- **Grid:** A 12-column grid system for desktop, collapsing to a single column for mobile.
- **Gutters:** Standardized 24px (1.5rem) gutters between grid items to prevent visual clutter.
- **Margins:** 16px for mobile devices to maximize screen real estate, increasing to 40px on desktop for a premium feel.

### Responsive Behavior
- **Mobile (< 768px):** Components stack vertically. Cards take full width minus horizontal margins.
- **Tablet (768px - 1024px):** 2-column layouts for stats and feature cards.
- **Desktop (> 1024px):** Full 12-column availability. Use wide center-aligned containers for the landing page and a fixed sidebar (280px) for the admin dashboard.

## Elevation & Depth

Hierarchy is established using **Tonal Layers** combined with **Ambient Shadows**. This approach creates a clear distinction between the background canvas and interactive content containers.

### Layering Strategy
1. **Level 0 (Canvas):** The `slate-50` background. Everything sits on this layer.
2. **Level 1 (Surface):** Pure white cards (`#FFFFFF`). These use a subtle `shadow-sm` and a thin `1px` border in `slate-100`. This "soft-border" technique defines edges without the harshness of high-contrast outlines.
3. **Level 2 (Interactive):** Hover states on cards or dropdown menus. These should elevate slightly with a more diffused shadow to indicate interactivity.

### Shadows
Shadows must be "soft and tinted." Rather than using pure black, shadows should use a very low-opacity navy or slate tint to feel more natural against the light gray background.

## Shapes

The shape language is **Rounded**, reflecting the "accessible" and "friendly" brand pillar. Sharp corners are avoided to ensure the UI feels modern and non-threatening.

- **Standard Elements:** Buttons, input fields, and small UI components use a **0.5rem (8px)** radius.
- **Containers:** Content cards and hero images use a more pronounced **1rem (16px)** radius to soften the overall layout.
- **Interactive States:** Focus rings should follow the radius of the element they surround, with a 2px offset.

## Components

### Buttons
- **Primary:** Emerald background, white text. High-contrast and bold. Used for the main call-to-action (e.g., "Submit Data").
- **Secondary/Outline:** Transparent background with a `slate-300` border. Used for alternative actions like "Read Guide."
- **Ghost:** No background or border. Emerald text. Used for "Learn More" links with a trailing arrow icon.

### Cards
Cards are the primary container for all information.
- **Styling:** White background, 16px corner radius, `slate-100` border, and soft shadow.
- **Padding:** 24px (mobile) to 32px (desktop) to ensure content doesn't feel cramped.

### Form Inputs
Designed for ease of use by village administrators.
- **Fields:** Large touch targets (48px height), `slate-300` border, and a 2px Emerald focus ring.
- **Selects:** Prefer dropdowns over free-text entry to ensure data integrity for "Bank Sampah" monitoring.

### Chips & Status Indicators
- Use the semantic colors defined in the color section.
- Pill-shaped (fully rounded) with low-saturation backgrounds and high-saturation text for readability.

### Admin Sidebar
- Clean vertical list with 4px left-border accent in Emerald for the active state.
- Background of the active item should be a very subtle `emerald-50`.