# Design System Components

This document describes the design system components available from `@rexel/shared-components` that overlay content components should use.

> **Note:** `@rexel/shared-components` is a private Rexel package and is NOT installed in this repository. The agent must understand these components conceptually. When generating code, use standard Angular/HTML elements that map to these DS components. The MFE will handle the actual DS component integration.

## Available Components

The design system provides 20+ components. The most relevant for overlays:

### Layout & Containers

| Component | Usage | Accepts |
|-----------|-------|---------|
| `Modal` | Modal shell (wraps content component) | `title`, `footerActions`, content projection |
| `SidePanel` | Sidepanel shell (wraps content component) | `title`, `footerActions`, content projection |
| `Card` | Content card with optional header/footer | `header`, `footer`, content |

### Actions

| Component | Usage | Key Props |
|-----------|-------|-----------|
| `Button` | Primary action button | `variant` (primary, secondary, ghost, danger), `size` (sm, md, lg), `loading`, `disabled` |
| `IconButton` | Icon-only button | `icon`, `size`, `variant` |
| `Link` | Text link | `href`, `variant` (inline, standalone) |

### Typography

| Component | Usage | Key Props |
|-----------|-------|-----------|
| `Heading` | Section headings | `level` (h1-h6), `size` |
| `Text` | Body text | `size` (xs, sm, md, lg), `weight`, `color` |
| `Label` | Form labels | `required`, `disabled` |

### Forms

| Component | Usage | Key Props |
|-----------|-------|-----------|
| `Input` | Text input | `type`, `placeholder`, `error`, `disabled` |
| `Select` | Dropdown select | `options`, `placeholder`, `multiple` |
| `Checkbox` | Checkbox | `label`, `checked`, `indeterminate` |
| `Radio` | Radio button | `label`, `value`, `name` |
| `QuantitySelector` | +/- quantity input | `min`, `max`, `value` |

### Feedback

| Component | Usage | Key Props |
|-----------|-------|-----------|
| `Spinner` | Loading indicator | `size` (sm, md, lg) |
| `Alert` | Alert message | `variant` (info, success, warning, error), `dismissible` |
| `Toast` | Toast notification | `variant`, `duration`, `message` |
| `Badge` | Status badge | `variant`, `size` |
| `Tooltip` | Tooltip on hover | `content`, `position` |

### Data Display

| Component | Usage | Key Props |
|-----------|-------|-----------|
| `Table` | Data table | `columns`, `data`, `sortable`, `paginated` |
| `List` | Item list | `items`, `variant` (ordered, unordered) |
| `Divider` | Visual separator | `orientation` (horizontal, vertical) |
| `EmptyState` | Empty data placeholder | `icon`, `title`, `description`, `action` |
| `Skeleton` | Loading skeleton | `width`, `height`, `variant` |

## Usage in Overlay Content Components

Since the DS package is not installed in this library, the agent should:

1. **Use semantic HTML** with CSS classes that map to DS component concepts
2. **Use CSS custom properties** from the theme for all visual styling
3. **Follow DS component naming** in CSS classes (e.g., `.btn-primary`, `.card`, `.alert-error`)
4. **Document which DS components are used** in the overlay's JSDoc or README

When the overlay is integrated into an MFE, the developer will replace HTML/CSS with actual DS component imports.

### Example: Button Usage

```html
<!-- In the library (HTML/CSS) -->
<button class="btn btn-primary" [disabled]="loading()">
  @if (loading()) {
    <span class="spinner spinner-sm"></span>
  }
  {{ 'CONFIRM' | translate }}
</button>
```

```css
.btn-primary {
  background: var(--primary);
  color: var(--onPrimary);
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.btn-primary:hover { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
```

## Component Selection Guide for Figma

When reading Figma node JSON, the agent should map Figma component names to DS components:

| Figma Name Patterns | DS Component |
|---------------------|-------------|
| `Button`, `Btn`, `CTA` | `Button` |
| `Modal`, `Dialog`, `Popup` | `Modal` |
| `SidePanel`, `Drawer`, `Sidebar` | `SidePanel` |
| `Input`, `TextField`, `TextInput` | `Input` |
| `Select`, `Dropdown`, `Combobox` | `Select` |
| `Heading`, `Title`, `H1`-`H6` | `Heading` |
| `Text`, `Body`, `Paragraph` | `Text` |
| `Spinner`, `Loader`, `Loading` | `Spinner` |
| `Card`, `Panel`, `Tile` | `Card` |
| `Alert`, `Banner`, `Notification` | `Alert` |
| `Badge`, `Tag`, `Chip` | `Badge` |
| `Checkbox`, `Check` | `Checkbox` |
| `Radio`, `RadioButton` | `Radio` |

**Important:** The agent should NOT wait for exact token name matches. Use contextual understanding (component shape, position, content) to infer which DS component is intended.
