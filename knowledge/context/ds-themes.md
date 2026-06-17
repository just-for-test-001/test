# Design System Themes

This document describes the theme system, available tokens, and per-banner variations.

> **Note:** The theme files in `projects/lib/assets/themes/` are **dummy data** for local development. Real themes are loaded by `@rexel/themes` (private package) in production.

## Theme System

- Themes are loaded as **CSS custom properties** on `:root`
- Each banner has its own theme JSON file: `assets/themes/{banner}.json`
- The `ThemeService` fetches the JSON and applies each key as `--{key}` on `document.documentElement`
- Components access tokens via `var(--tokenName)` in CSS

## Available Tokens

### Colors

| Token | Purpose | Example (FRX) |
|-------|---------|---------------|
| `--primary` | Primary brand color | `#e65100` |
| `--primaryLight` | Lighter primary variant | `#ff8f00` |
| `--primaryDark` | Darker primary variant | `#bf360c` |
| `--secondary` | Secondary brand color | `#ff6d00` |
| `--accent` | Accent/highlight color | `#ffab40` |
| `--background` | Page/modal background | `#fff8f0` |
| `--surface` | Card/panel surface | `#ffffff` |
| `--error` | Error state color | `#d32f2f` |
| `--border` | Border color | `#ffcc80` |

### Text Colors

| Token | Purpose | Example (FRX) |
|-------|---------|---------------|
| `--textPrimary` | Primary text color | `#3e2723` |
| `--textSecondary` | Secondary/muted text | `#8d6e63` |

### On-Colors (text on colored backgrounds)

| Token | Purpose | Example (FRX) |
|-------|---------|---------------|
| `--onPrimary` | Text on primary background | `#ffffff` |
| `--onSecondary` | Text on secondary background | `#ffffff` |
| `--onBackground` | Text on page background | `#3e2723` |
| `--onSurface` | Text on surface | `#3e2723` |

## Per-Banner Theme Values

### FRX (France) — Orange/Warm

```json
{
  "primary": "#e65100",
  "primaryLight": "#ff8f00",
  "primaryDark": "#bf360c",
  "secondary": "#ff6d00",
  "accent": "#ffab40",
  "background": "#fff8f0",
  "surface": "#ffffff",
  "error": "#d32f2f",
  "onPrimary": "#ffffff",
  "onSecondary": "#ffffff",
  "onBackground": "#3e2723",
  "onSurface": "#3e2723",
  "border": "#ffcc80",
  "textPrimary": "#3e2723",
  "textSecondary": "#8d6e63"
}
```

### CND (Canada NEDCO) — Purple/Deep

```json
{
  "primary": "#4527a0",
  "primaryLight": "#7c4dff",
  "primaryDark": "#311b92",
  "secondary": "#283593",
  "accent": "#651fff",
  "background": "#f5f0ff",
  "surface": "#ffffff",
  "error": "#b71c1c",
  "onPrimary": "#ffffff",
  "onSecondary": "#ffffff",
  "onBackground": "#1a0d3e",
  "onSurface": "#1a0d3e",
  "border": "#b39ddb",
  "textPrimary": "#1a0d3e",
  "textSecondary": "#7e57c2"
}
```

### GYW (Germany) — Teal/Nature

```json
{
  "primary": "#00695c",
  "primaryLight": "#26a69a",
  "primaryDark": "#004d40",
  "secondary": "#00838f",
  "accent": "#00acc1",
  "background": "#f0faf8",
  "surface": "#ffffff",
  "error": "#c62828",
  "onPrimary": "#ffffff",
  "onSecondary": "#ffffff",
  "onBackground": "#1b3530",
  "onSurface": "#1b3530",
  "border": "#80cbc4",
  "textPrimary": "#1b3530",
  "textSecondary": "#607d8b"
}
```

## CSS Usage Rules

1. **ALWAYS** use `var(--tokenName)` — never hardcode color values
2. **Use transitions** for smooth theme switching: `transition: background 0.3s ease, color 0.3s ease`
3. **Semantic mapping:**
   - Backgrounds: `var(--background)` for page, `var(--surface)` for cards/panels
   - Text: `var(--textPrimary)` for headings/body, `var(--textSecondary)` for muted
   - Actions: `var(--primary)` for primary buttons, `var(--secondary)` for secondary
   - Errors: `var(--error)` for error states
   - Borders: `var(--border)` for all borders
4. **Text on colored backgrounds:** Use `var(--onPrimary)`, `var(--onSecondary)` etc.
5. **Hover states:** Use `opacity: 0.88` on primary buttons, `background: var(--border)` on secondary

## Storybook Theme Switching

The Storybook preview automatically loads the correct theme when the locale changes. No per-story setup is needed.

The locale toolbar maps:
- `frx_fr` → loads FRX theme
- `cnd_en` / `cnd_fr` → loads CND theme
- `gyw_de` → loads GYW theme
