# Translation Conventions

This document defines how translations are managed in the overlays library.

## Overview

- **Library:** `@ngx-translate/core` (v16)
- **Locale format:** `{banner}_{language}` (e.g., `frx_fr`, `cnd_en`, `gyw_de`)
- **Translation files:** `projects/lib/assets/i18n/{locale}.json`
- **Loading:** `TranslationService` fetches JSON and loads into `TranslateService` store
- **Storybook:** Locale switcher in toolbar (preview.ts) handles loading automatically

## Translation File Structure

Each locale has its own JSON file at `projects/lib/assets/i18n/{banner}_{language}.json`.

### File Naming

| Banner             | Language | File          |
| ------------------ | -------- | ------------- |
| FRX (France)       | French   | `frx_fr.json` |
| CND (Canada NEDCO) | English  | `cnd_en.json` |
| CND (Canada NEDCO) | French   | `cnd_fr.json` |
| GYW (Germany)      | German   | `gyw_de.json` |

### Key Naming Convention

Translation keys use **UPPERCASE_SNAKE_CASE** with a **namespace prefix** matching the overlay name:

```json
{
  "SESSION_TIMEOUT_TITLE": "Your session is about to expire",
  "SESSION_TIMEOUT_MESSAGE": "You have been inactive for {minutes} minutes",
  "SESSION_TIMEOUT_CONFIRM": "Stay signed in",
  "SESSION_TIMEOUT_CANCEL": "Sign out",
  "CART_ABANDONMENT_TITLE": "Don't forget your cart!",
  "CART_ABANDONMENT_ITEMS_COUNT": "{count} items in your cart"
}
```

### Rules

1. **UPPERCASE_SNAKE_CASE** for all keys
2. **Namespace prefix** = overlay name in UPPER*SNAKE_CASE (e.g., `SESSION_TIMEOUT*`, `CART*ABANDONMENT*`)
3. **Group by overlay** — all keys for one overlay are together in the JSON
4. **Use interpolation** for dynamic values: `{variableName}` syntax
5. **All 4 locale files** must have the same keys (values differ by language)
6. **Never hardcode text** in component templates — always use `{{ 'KEY' | translate }}`

### Adding Translations for a New Overlay

1. Add keys to ALL 4 locale files (`frx_fr.json`, `cnd_en.json`, `cnd_fr.json`, `gyw_de.json`)
2. Use the overlay name as prefix: `OVERLAY_NAME_KEY_NAME`
3. Provide correct translations per language
4. Use the pipe in templates: `{{ 'OVERLAY_NAME_KEY_NAME' | translate }}`

### Interpolation Example

```json
{
  "SESSION_TIMEOUT_MESSAGE": "You have been inactive for {minutes} minutes"
}
```

```html
<p>{{ 'SESSION_TIMEOUT_MESSAGE' | translate: { minutes: inactivityMinutes() } }}</p>
```

## TranslationService API

```typescript
// Load translations for a banner+language combination
translationService.loadTranslations("frx", "fr").subscribe();

// The service builds the URL: assets/i18n/frx_fr.json
// Translations are merged with existing translations for that locale
// Results are shared via shareReplay(1) — multiple subscribers reuse the same request
```

## Storybook Locale Switching

The Storybook preview.ts provides a locale toolbar with all 4 locales:

- FRX - Français (`frx_fr`)
- CND - English (`cnd_en`)
- CND - Français (`cnd_fr`)
- GYW - Deutsch (`gyw_de`)

When the locale changes, the preview automatically:

1. Fetches the translation JSON
2. Loads it into `TranslateService`
3. Switches the active locale
4. Loads the corresponding theme

**No manual setup needed in stories** — translations work automatically.
