# Rexel Webshop Context

This document provides general context about the Rexel Webshop that the AI agent needs to understand.

## Overview

Rexel is a global electrical distribution company. The Rexel Webshop is an e-commerce platform being migrated from Hybris (legacy) to Angular with a Micro-Frontend (MFE) architecture using native federation.

## Multi-Tenant Architecture (by Banner)

The webshop is **multi-tenant by banner**. A "banner" is a brand/identity under which the webshop operates in a specific market.

### Regions & Banners

| Region | Banner Code             | Country                 | Languages                     |
| ------ | ----------------------- | ----------------------- | ----------------------------- |
| EMEA   | `frx`                   | France (Rexel France)   | French (`fr`)                 |
| EMEA   | `gyw`                   | Germany (Rexel Germany) | German (`de`)                 |
| APAC   | (Australia banners TBD) | Australia               | English (`en`)                |
| AMER   | `cnd`                   | Canada (NEDCO)          | English (`en`), French (`fr`) |

> **Note:** APAC region exists but specific banner codes are not yet defined in this project. This row is a placeholder to ensure the agent knows the full multi-region scope.

### Locale Format

Locale = `{banner}_{language}` (e.g., `frx_fr`, `cnd_en`, `gyw_de`)

This format is used for:

- Translation file naming: `assets/i18n/frx_fr.json`
- Translation service key: `TranslationService.loadTranslations('frx', 'fr')`
- Storybook locale switcher

## URL Structure

Each banner has its own URL prefix, except Germany:

| Banner | URL Format                         | Example                 |
| ------ | ---------------------------------- | ----------------------- |
| FRX    | `rexel.fr/{banner}/path`           | `rexel.fr/frx/products` |
| CND    | `nedco.ca/{banner}/path`           | `nedco.ca/cnd/cart`     |
| GYW    | `rexel.de/path` (NO banner prefix) | `rexel.de/products`     |

**Important:** Germany (GYW) does NOT include the banner in the URL path. The agent must handle this exception when generating URL-related logic or redirections.

## MFE Architecture

- **Shell MFE:** The main application shell that hosts all MFEs, owns the router, loads translations and themes
- **Feature MFEs:** Independent Angular applications (cart, product-list, checkout, etc.) loaded via native federation
- **Overlays Library (this project):** Published as an npm package, installed in MFEs that need modals/sidepanels
- **Native Federation:** Each MFE declares its dependencies in a federation config. The overlays library should be configured as a **singleton** to prevent loading the same modal multiple times when used across multiple MFEs

## Translation Loading

- Translations are loaded **once in the Shell MFE** at startup
- The `TranslationService` fetches the locale JSON and loads it into `@ngx-translate/core`'s store
- All MFEs and overlays access translations via `TranslateService` / `TranslatePipe`
- The Shell determines the locale from the current banner + user language preference

## Theme Loading

- Each banner has its own theme (colors, fonts, spacing)
- Themes are loaded by `@rexel/themes` (private package) on the Shell
- Theme values are injected as CSS custom properties on `:root`
- All components use `var(--token-name)` for styling — never hardcoded values
- For Storybook, the dummy `ThemeService` loads theme JSON from `assets/themes/{banner}.json`

## Triggers for Overlays

Overlays have two trigger patterns:

1. **Instant overlays:** Open immediately when the user performs an action (e.g., click "Quick Order" button)
2. **Timed overlays:** Open after a delay or condition (e.g., session timeout after 30 min of inactivity, cart abandonment after leaving the site)

## Design System

The webshop uses `@rexel/shared-components` (private package) for UI components: Button, Modal, SidePanel, Typography, Form elements, and 20+ more.

The overlays library **content components** will be wrapped by the Shell's Modal/SidePanel component from this design system. Content components should NOT import or use the Modal/SidePanel shell directly — they are purely the inner content.

## Private Packages (not installed in this repo)

- `@rexel/shared-components` — Design system UI components
- `@rexel/themes` — Banner-specific theme tokens and loading

These are mocked locally with dummy components and services for development and testing.
