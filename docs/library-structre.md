# Library Structure

This document defines how to create a new overlay (modal or sidepanel content component) in `projects/lib/`.

## Folder Structure

Each overlay is a **dedicated folder** inside `projects/lib/` with a **kebab-case** feature name:

```
projects/lib/
  lib/
    assets/                                 # Shared assets (translations, themes)
      i18n/                                 # Translation JSON files per locale
        {banner}_{language}.json            # Translation file for each banner & language (e.g., frx_fr.json, gyw_de.json)
    {overlay-name}/
      _specs/                               # Specs (Figma JSON + Jira markdown)
        figma.json                          # Figma node JSON (from MCP or API)
        jira.md                             # Jira ticket markdown (from bash/GQL)
      services/                             # Overlay-specific services (business logic, API calls, state)
        {service-name}.service.ts           # Service file
        {service-name}.service.spec.ts      # Unit tests for service
        {service-name}.service.mock.ts      # Mock service for storybook (if needed)
      models/                               # Overlay-specific models (interfaces, types, enums)
        {model-name}.model.ts               # Model file
      components/                           # Overlay-specific sub components
        {component-name}.component.ts       # Content component (standalone, OnPush)
        {component-name}.component.spec.ts  # Unit tests for component
        {component-name}.component.html     # Template file (if not inline)
        {component-name}.component.scss     # Styles file (if not inline)
      {overlay-name}.component.ts           # Content component (standalone, OnPush)
      {overlay-name}.component.spec.ts      # Unit tests (Jest)
      {overlay-name}.component.html         # Template file (if not inline)
      {overlay-name}.component.scss         # Styles file (if not inline)
      public-api.ts                         # Barrel export
      ng-package.json                       # ng-packagr entry config
  storybook/
    stories/                                # Overlay stories
      {overlay-name}/
        {overlay-name}.mdx                  # Storybook MDX documentation for overlay
        {overlay-name}.stories.ts           # Storybook stories for overlay
        {overlay-name}.stories.test.ts      # Storybook interaction tests for overlay
```
