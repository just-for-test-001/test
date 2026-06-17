# Overlay Project Context

This document describes what the Overlays Project is, its architecture, and key decisions.

## What Is This Project?

The Overlays Project (`mf-overlays-lib`) is an Angular library that exports **modal and sidepanel content components** for the Rexel Webshop's MFE architecture.

> **See also:** `knowledge/context/webshop-context.md` for general Rexel Webshop info (regions, banners, URL structure, MFE architecture). This file focuses specifically on the overlay library decisions.

### Problem Being Solved

During the Hybris → Angular migration, modals and sidepanels still live in old Hybris or are scattered across MFEs. This library centralizes them into a shared, independently publishable package.

### How It Works

1. Each modal/sidepanel is a **standalone content component** exported as its own sub-package
2. MFEs install the library and import only the overlays they need (tree-shaking / sub-package loading)
3. The MFE's shell provides the Modal/SidePanel container (from `@rexel/shared-components`)
4. The overlay content component is projected into the shell's Modal/SidePanel
5. The MFE controls open/close lifecycle; the overlay handles its own business logic

## Architecture Decisions

### Composition: Content-Component Pattern

The library exports only the inner **content component**. The Shell's Modal/SidePanel wraps it. The MFE controls the open/close lifecycle.

### Services: Self-Contained

Each overlay folder owns its services completely. No shared services layer. API calls, data fetching, and business logic are encapsulated within each overlay.

### Data Contract: Lean Inputs

MFE passes **identifiers** (userId, cartId) + **configuration** (timeout, display options). The overlay fetches its own data via its service. Outputs are **decisions**: `{ action: 'confirm' | 'cancel' | 'dismiss', payload?: T }`.

### Folder Organization: Flat Feature Names

All overlays are flat siblings in `projects/lib/{kebab-name}/`. Type (modal vs sidepanel) is metadata, not folder structure.

## Library Structure

```
projects/lib/
  {overlay-name}/              # Each overlay is a sub-package
    {name}.component.ts        # Content component
    {name}.service.ts          # Business logic & API
    {name}.model.ts            # Types & interfaces
    {name}.component.spec.ts   # Unit tests
    public-api.ts              # Barrel export
    ng-package.json            # ng-packagr config
    _specs/                    # Design & product specs (not published)
  translation/                 # Shared translation service
  theme/                       # Shared theme service (dummy for dev)
  assets/
    i18n/                      # Translation JSON files per locale
    themes/                    # Theme JSON files per banner
```

## Storybook Purpose

Storybook is used for **local development and visual validation**, NOT as a testing environment for real APIs. For modals with API calls, mock services are provided at the DI level.

The development cycle:

1. Receive Figma design + Jira ticket
2. Create component and its Storybook story
3. Validate visually in Storybook
4. Integrate into the target MFE for real-data testing

## CI/CD

- Storybook is built and deployed to GitHub Pages on every push to `main`
- Interaction tests (`test-storybook`) run as a CI gate before deployment
- Unit tests (`npm test`) run locally and in CI

## Federation Singleton

When an overlay is used across multiple MFEs simultaneously, it must be loaded only once. This is achieved by configuring the library as a singleton in each MFE's `federation.config.json`.
