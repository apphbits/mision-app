---
name: Mindful Sanctuary
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#3f4944'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#707973'
  outline-variant: '#bfc9c2'
  surface-tint: '#256a51'
  primary: '#1e644b'
  on-primary: '#ffffff'
  primary-container: '#3a7d63'
  on-primary-container: '#dbffec'
  inverse-primary: '#90d5b6'
  secondary: '#8b5015'
  on-secondary: '#ffffff'
  secondary-container: '#feb06d'
  on-secondary-container: '#784104'
  tertiary: '#006729'
  on-tertiary: '#ffffff'
  tertiary-container: '#008336'
  on-tertiary-container: '#e1ffde'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf1d1'
  primary-fixed-dim: '#90d5b6'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#00513a'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#ffb77c'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#6d3900'
  tertiary-fixed: '#89fa9b'
  tertiary-fixed-dim: '#6ddd81'
  on-tertiary-fixed: '#002108'
  on-tertiary-fixed-variant: '#005320'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Outfit
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Outfit
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Outfit
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1.25rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design narrative embodies organic minimalism and personal sanctuary. Built around intentions rather than relentless gamification, the interface prioritizes psychological safety, mental clarity, and deliberate rhythm. Instead of aggressive notifications and high-friction urgency cues, the interface provides a grounded environment where daily rituals can unfold calmly.

The design movement bridges Japanese organic minimalism with tactile Scandinavian warmth:
- Generous, uncluttered negative space that allows users to exhale visually.
- Architectural geometry paired with humanist typographic rhythm.
- Soft physical surfaces, delicate border framing, and warmth that feels like smooth ceramic, woven linen, and diffuse morning light.
- Subtle, quiet celebrations that honor consistency over perfectionism.

## Colors

The palette is rooted in balanced earth tones and botanical tranquility. Every tint and shade is calibrated to avoid eye fatigue and visual overstimulation.

- **Primary (`#3A7D63`)**: Balanced sage green representing organic grounding, daily renewal, and stability. Used for primary interactive triggers, active tab states, and key navigational pivots.
- **Secondary (`#F3A664`)**: Warm apricot glow applied to streaks, reflective milestones, and motivational sparks. It imparts gentle encouragement without creating high-pressure urgency.
- **Tertiary (`#34A853`)**: Vibrant botanical leaf green used specifically for task completion, ritual fulfillment, and positive feedback affirmations.
- **Neutral & Typography (`#1E293B`)**: Deep slate charcoal rather than pure black (`#000000`), preserving contrast without harsh optical friction.
- **Canvas & Containers**: The default canvas anchors on an organic warm bone (`#F8F8F5`), layered with crisp, pristine white (`#FFFFFF`) interior surface cards and floating modules.

## Typography

Typography balances the architectural, geometric presence of **Outfit** for structural headings and labels with the humanist, highly legible cadence of **Manrope** for body reading, microcopy, and habit journaling.

- **Headlines (Outfit)**: Characterized by open geometric proportions, circular counters, and distinct modern elegance. Expresses quiet clarity and calm intention.
- **Body Text (Manrope)**: Delivers smooth horizontal eye flow and natural word spacing, crucial for self-reflection prompts, introspective journaling, and daily check-ins.
- **Scale Adjustments**: Display and large headline sizes step down on mobile screens to preserve breathing room and prevent visual crowding.

## Layout & Spacing

The layout model is anchored on fluid flex structures embedded within a 12-column desktop grid and a 4-column mobile shell. Whitespace is treated as an active design element rather than empty space, reinforcing emotional breathing room.

- **Mobile Viewport (< 640px)**: 4 columns, 16px gutter (`gutter`), 20px outer canvas margin (`margin`). Habit blocks span full width or sit in balanced 2x2 grids for daily rituals.
- **Tablet Viewport (640px – 1024px)**: 8 columns, 20px gutter, 32px margin. Habit tracking rows split evenly alongside progress overviews.
- **Desktop Viewport (> 1024px)**: 12 columns constrained to a max-width container of 1140px, 24px gutter (`gutter-desktop`), 40px outer margin (`margin-desktop`). Focus is maintained through centered ritual streams flanked by contextual side panels.

## Elevation & Depth

Visual hierarchy uses warm, diffuse ambient elevation and layered container tiers rather than heavy artificial drop shadows:

- **Surface Tiers**:
  - **Level 0 (Canvas)**: Warm base tint (`#F8F8F5`), flat and unadorned.
  - **Level 1 (Cards & Modular Tiles)**: Pure white (`#FFFFFF`) with a micro-border of `rgba(30, 41, 59, 0.05)` and a warm ambient drop: `0px 4px 20px -2px rgba(46, 60, 54, 0.04)`.
  - **Level 2 (Floating Action Triggers, Sheets & Active Habits)**: `0px 10px 30px -4px rgba(46, 60, 54, 0.08)`.
- **Ghost Outlines**: Structural borders are thin (1px) and low contrast, framing content without interrupting visual flow.

## Shapes

With `roundedness: 2`, geometry across the system delivers soft, organic contours:

- **Base Radius (`0.5rem` / `8px`)**: Used for contextual inputs, badges, and smaller micro-interactive items.
- **Large Radius (`rounded-lg` - `1rem` / `16px`)**: Standard for content cards, routine modules, and modals.
- **Extra Large Radius (`rounded-xl` - `1.5rem` / `24px`)**: Used for hero progress cards, featured habits, and floating bottom navigation shells.
- **Full Radius (Capsule / Pill)**: Reserved for primary action buttons, streak indicators, and quick-filter chips.

## Components

### Buttons
- **Primary**: Full pill shape (`rounded-full`), solid sage green (`#3A7D63`), text in white (`#FFFFFF`), with an elevation lift on hover (`rgba(58, 125, 99, 0.2)` diffuse shadow).
- **Secondary / Ghost**: Pure white background with a soft border (`1px solid rgba(30, 41, 59, 0.08)`) and slate charcoal text (`#1E293B`).
- **Warm Affirmation (Achievement / Sparks)**: Soft apricot container (`#F3A664` at 15% opacity) with deeper apricot text (`#B86B28`).

### Habit & Routine Cards
- White surface (`#FFFFFF`), `rounded-lg` or `rounded-xl` borders with fine perimeter borders.
- Spacious internal padding (`space-lg`), pairing a ritual title, category tag, and completion indicator.
- Subtle scale transition (`transform: scale(0.99)`) upon tactile press to simulate physical responsiveness.

### Checkboxes & Completion Radios
- Oversized interactive target (minimum 44x44px hit box, 24px visual circle).
- Neutral resting state: Crisp 1.5px border in slate tone (`rgba(30, 41, 59, 0.2)`).
- Completed state: Botanical green fill (`#34A853`) housing a clean white checkmark, accompanied by a gentle outward pulse animation.

### Chips & Filter Pills
- Fully rounded capsule silhouette with internal spacing (`space-xs` vertical, `space-md` horizontal).
- Inactive: Off-white fill (`rgba(30, 41, 59, 0.04)`) with muted label typography.
- Active: Sage green (`#3A7D63`) with white text.

### Streak & Spark Badges
- Soft warm butter/apricot tint (`#FDF5EC`) with accent orange border (`#F3A664`).
- Incorporates minimalist line iconography (spark, sun, or flame) paired with an `Outfit` semi-bold counter.

### Input Fields & Reflection Prompts
- Background in subtle warm tint (`#F5F5F0`), smoothly transitioning to pure white on focus with a delicate sage border glow (`rgba(58, 125, 99, 0.25)`).
- Generous padding (`space-md`) for writing daily intentions and reflective notes.