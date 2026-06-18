# Levelplay Design System

## Color Theme: Professional Construction - Cyan/Teal

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--cyan-primary` | `#0891b2` (cyan-600) | Primary brand color, main CTA buttons |
| `--cyan-light` | `#06b6d4` (cyan-500) | Hover states, accents |
| `--teal-primary` | `#0d9488` (teal-600) | Secondary brand color, alternate CTAs |
| `--teal-light` | `#14b8a6` (teal-500) | Secondary accents |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--ok` | `#059669` (emerald-600) | Success states, positive feedback |
| `--warn` | `#f59e0b` (amber-500) | Warning states, caution indicators |
| `--danger` | `#dc2626` (red-600) | Error states, destructive actions |

### Neutral Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#0a0f1a` | Primary dark background |
| `--navy-2` | `#0f172a` | Secondary dark background |
| `--slate` | `#475569` | Medium gray text |
| `--steel` | `#64748b` | Light gray text |
| `--mist` | `#e2e8f0` | Very light gray |
| `--paper` | `#f8fafc` | Near-white background |
| `--white` | `#ffffff` | Pure white |

---

## Button Variants

### Primary Button
**Use for**: Main actions, primary CTAs
```tsx
<Button variant="default">Get Started</Button>
```
- Background: `linear-gradient(135deg, cyan-500, cyan-600)`
- Text: `white`
- Shadow: `shadow-lg shadow-cyan-500/25`
- Hover: `from-cyan-600 to-cyan-700` with stronger shadow

### Secondary Button
**Use for**: Secondary actions, alternative CTAs
```tsx
<Button variant="secondary">Learn More</Button>
```
- Background: `linear-gradient(135deg, teal-500, teal-600)`
- Text: `white`
- Shadow: `shadow-lg shadow-teal-500/25`
- Hover: `from-teal-600 to-teal-700` with stronger shadow

### Outline Button
**Use for**: Tertiary actions, less important options
```tsx
<Button variant="outline">View Details</Button>
```
- Background: `transparent`
- Border: `2px solid cyan-500/30`
- Text: `slate-900` (light) / `white` (dark)
- Hover: Light cyan background

### Ghost Button
**Use for**: Navigation, subtle interactions
```tsx
<Button variant="ghost">Cancel</Button>
```
- Background: `transparent`
- No border
- Hover: Light cyan background with cyan text

### Destructive Button
**Use for**: Delete, remove, dangerous actions
```tsx
<Button variant="destructive">Delete Project</Button>
```
- Background: `red-600`
- Text: `white`
- Shadow: `shadow-lg shadow-red-500/25`

---

## Typography

### Font Families
- **Display**: `'Space Grotesk'` - Headings, brand elements
- **Body**: `'Inter'` - Body text, UI elements

### Font Weights
- **Regular**: `400` - Body text
- **Medium**: `500` - Labels, captions
- **Semibold**: `600` - Buttons, emphasis
- **Bold**: `700` - Headings

### Type Scale
```css
h1: clamp(2rem, 5vw, 3.4rem);
h2: clamp(1.5rem, 3vw, 2.2rem);
body: 1rem (16px);
small: 0.875rem (14px);
caption: 0.75rem (12px);
```

---

## Spacing Scale

Follow 4px incremental system:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

---

## Border Radius

- **Components**: `0.75rem` (12px) - Cards, buttons
- **Small**: `0.5rem` (8px) - Badges, chips
- **Large**: `1rem` (16px) - Modals, panels
- **Full**: `9999px` - Pills, tags

---

## Shadows

```css
--shadow-sm: 0 4px 14px rgba(8, 145, 178, 0.08);
--shadow: 0 20px 40px rgba(8, 145, 178, 0.10);
```

**Button shadows**: Use color-specific shadows
- Primary: `shadow-cyan-500/25`
- Secondary: `shadow-teal-500/25`
- Destructive: `shadow-red-500/25`

---

## Animation Timing

- **Fast**: `150ms` - Hover states, ripples
- **Normal**: `200ms` - Button presses, toggles
- **Slow**: `300ms` - Page transitions, modals
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth, professional

---

## Usage Rules

### ✅ DO:
- Use cyan/teal gradients for all primary/secondary CTAs
- Maintain consistent border-radius (12px for buttons)
- Use semantic color tokens (`--ok`, `--warn`, `--danger`)
- Keep button shadows subtle and color-appropriate
- Use emerald-600 for success states
- Apply hover animations with scale (1.02-1.05)

### ❌ DON'T:
- Mix amber/orange/gold colors (old theme)
- Use pill-shaped buttons (`border-radius: 9999px`)
- Create custom gradients outside the system
- Use emojis as icons (use SVG icon libraries)
- Apply shadows heavier than `shadow-xl`
- Use colors without checking dark mode contrast

---

## Component Examples

### Login/CTA Button
```tsx
<motion.button
  className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/35"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Sign In
</motion.button>
```

### Logo Badge
```tsx
<div className="bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20">
  LP
</div>
```

### Navigation Underline
```tsx
<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-500 group-hover:w-full transition-all duration-300"></span>
```

---

## Dark Mode

All colors have dark mode variants defined in CSS:
- Backgrounds are automatically inverted
- Text maintains proper contrast ratios
- Cyan/teal colors remain consistent
- Borders and shadows adapt to dark theme

Test both light and dark modes before deployment.

---

## Accessibility

- All text maintains minimum 4.5:1 contrast ratio
- Focus rings use `ring-cyan-500` at 2px width
- Touch targets minimum 44×44px
- Reduced motion respects `prefers-reduced-motion`

---

## Migration Notes

### Changed from Amber/Orange to Cyan/Teal:
- Primary buttons: `from-amber-500 to-orange-500` → `from-cyan-500 to-cyan-600`
- Logos: `from-amber-400 to-orange-500` → `from-cyan-400 to-cyan-600`
- Shadows: `shadow-amber-500/20` → `shadow-cyan-500/25`
- Hover text: `hover:text-amber-400` → `hover:text-cyan-400`

### Border Radius:
- Changed from pill (`rounded-full`) to modern (`rounded-xl` = 12px)

### Button Text Color:
- Primary buttons now use `text-white` instead of `text-slate-950`
- Improved contrast on gradient backgrounds
