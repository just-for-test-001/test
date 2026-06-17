# Figma Guide

This document teaches the AI agent how to understand Figma node JSON and convert it to Angular overlay components.

## Overview

When creating an overlay, the agent receives a `figma.json` file containing the raw Figma node tree for the selected frame/component. This JSON describes the visual structure, layout, styling, and component references.

## Figma Node Structure

A Figma node tree looks like:

```json
{
  "id": "123:456",
  "name": "Session Timeout Modal",
  "type": "FRAME",
  "absoluteBoundingBox": { "x": 0, "y": 0, "width": 480, "height": 320 },
  "fills": [{ "type": "SOLID", "color": { "r": 1, "g": 0.97, "b": 0.94 } }],
  "children": [
    {
      "name": "Header",
      "type": "FRAME",
      "children": [
        {
          "name": "Title",
          "type": "TEXT",
          "characters": "Your session is about to expire",
          "style": { "fontSize": 18, "fontWeight": 600 }
        }
      ]
    },
    {
      "name": "Body",
      "type": "FRAME",
      "children": [...]
    },
    {
      "name": "Footer",
      "type": "FRAME",
      "children": [
        {
          "name": "Cancel Button",
          "type": "INSTANCE",
          "componentId": "btn-secondary-id",
          "children": [
            { "name": "Label", "type": "TEXT", "characters": "Cancel" }
          ]
        },
        {
          "name": "Confirm Button",
          "type": "INSTANCE",
          "componentId": "btn-primary-id",
          "children": [
            { "name": "Label", "type": "TEXT", "characters": "Stay signed in" }
          ]
        }
      ]
    }
  ]
}
```

## Key Node Types

| Figma Type | Angular Mapping |
|------------|-----------------|
| `FRAME` | `<div>` or semantic element |
| `TEXT` | `<h1>`-`<h6>`, `<p>`, `<span>` based on style |
| `INSTANCE` | DS component usage (Button, Input, etc.) |
| `COMPONENT` | DS component definition |
| `RECTANGLE` | `<div>` with background |
| `VECTOR` / `SVG` | Inline SVG or icon |
| `GROUP` | `<div>` (flex/grid container) |

## Parsing Strategy

### Step 1: Identify the Root Frame
The root node is the overlay's outermost container. It defines the overall dimensions, background, and border radius.

### Step 2: Identify Sections
Look for named frames that represent semantic sections:
- `Header`, `Title`, `TopBar` → overlay header area
- `Body`, `Content`, `Main` → main content area
- `Footer`, `Actions`, `Buttons` → action area
- `Sidebar`, `Navigation` → sidepanel nav area

### Step 3: Map Design System Components
For `INSTANCE` nodes, identify the DS component by:
1. **Exact match:** Component name contains a DS component name (e.g., "Button", "Input")
2. **Pattern match:** Node structure matches a DS component pattern
3. **Contextual inference:** Position, size, and content suggest a component type (see ds-components.md mapping table)

### Step 4: Extract Text Content
For `TEXT` nodes, extract the `characters` property. This becomes:
- Translation keys in the component template: `{{ 'KEY' | translate }}`
- The key name follows the convention: `{OVERLAY_NAME}_{ELEMENT_PURPOSE}`

### Step 5: Extract Styles
For each node, extract:
- `fills` → `background-color` (map to theme token)
- `strokes` → `border-color` (map to `var(--border)`)
- `cornerRadius` → `border-radius`
- `padding` / `paddingLeft/Right/Top/Bottom` → CSS padding
- `itemSpacing` → `gap` in flexbox/grid
- `style.fontSize` → `font-size`
- `style.fontWeight` → `font-weight`
- `style.lineHeightPx` → `line-height`
- `style.letterSpacing` → `letter-spacing`
- `opacity` → `opacity`

### Step 6: Map Colors to Theme Tokens
Figma colors must be mapped to CSS custom properties:

| Figma Color Pattern | Token |
|---------------------|-------|
| Brand primary color | `var(--primary)` |
| Light primary variant | `var(--primaryLight)` |
| Dark primary variant | `var(--primaryDark)` |
| Secondary brand color | `var(--secondary)` |
| Accent/highlight | `var(--accent)` |
| White/light background | `var(--surface)` |
| Off-white/page bg | `var(--background)` |
| Error/red | `var(--error)` |
| Border/separator | `var(--border)` |
| Dark text | `var(--textPrimary)` |
| Muted/gray text | `var(--textSecondary)` |
| White text on primary | `var(--onPrimary)` |

**Important:** Do NOT hardcode Figma color values. Always map to a theme token. If the exact token is ambiguous, use the closest semantic match.

## Auto-Layout Mapping

Figma's Auto-Layout maps to CSS flexbox:

| Figma Property | CSS Property |
|----------------|-------------|
| `layoutMode: "HORIZONTAL"` | `display: flex; flex-direction: row` |
| `layoutMode: "VERTICAL"` | `display: flex; flex-direction: column` |
| `itemSpacing` | `gap: {value}px` |
| `primaryAxisAlignItems: "CENTER"` | `justify-content: center` |
| `counterAxisAlignItems: "CENTER"` | `align-items: center` |
| `paddingLeft/Right/Top/Bottom` | `padding: {t} {r} {b} {l}` |

## Common Pitfalls

1. **Don't recreate DS components from scratch.** If a button is clearly a DS Button, use the button pattern — don't build a custom button with 10 nested divs.
2. **Don't over-nest.** Figma often has wrapper frames for organization. Flatten unnecessary nesting in the Angular template.
3. **Ignore decorative frames.** Some Figma frames are just for layout in the design tool. Focus on semantic meaning.
4. **Text styles ≠ components.** A styled text node is just typography, not a component instance.
5. **Colors are approximate — use fuzzy matching.** Figma may use slight color variations from the documented theme tokens. Map to the nearest semantic token, not the exact hex value. For example, `#e85d00` in Figma is likely `--primary` for FRX even though the documented value is `#e65100`. Judge by hue family (orange → FRX primary, purple → CND primary, teal → GYW primary), not exact RGB.
6. **Responsive design.** Figma designs are usually fixed-width. The agent should use flexible CSS (%, max-width, clamp) instead of hardcoded pixel widths.
