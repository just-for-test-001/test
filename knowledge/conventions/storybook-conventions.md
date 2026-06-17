# Storybook Conventions

This document defines how to create Storybook stories and documentation for overlays.

## Story File Structure

Each overlay gets its own **subdirectory** under `projects/storybook/src/stories/`:

```
projects/storybook/src/stories/
  {overlay-name}/
    {overlay-name}.stories.ts      # Story with interaction tests
    {overlay-name}.mdx             # Documentation page (optional, Phase 2)
```

## Story Template

```typescript
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { of } from 'rxjs';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { SessionTimeoutComponent } from '../../../lib/session-timeout/public-api';
import { SessionTimeoutService } from '../../../lib/session-timeout/session-timeout.service';

// --- Mock Service ---
const mockSessionTimeoutService: Partial<SessionTimeoutService> = {
  getData: (userId: string) => of({
    userId,
    lastActivity: '2024-01-15T10:30:00Z',
    cartItemCount: 3,
  }),
};

// --- Meta ---
const meta: Meta<SessionTimeoutComponent> = {
  title: 'Overlays/SessionTimeout',
  component: SessionTimeoutComponent,
  decorators: [
    // Provide mock service at DI level
    applicationConfig({
      providers: [
        { provide: SessionTimeoutService, useValue: mockSessionTimeoutService },
      ],
    }),
  ],
  argTypes: {
    // Define arg types for inputs
    userId: { control: 'text', defaultValue: 'user-123' },
    inactivityMinutes: { control: 'number', defaultValue: 30 },
  },
  parameters: {
    controls: {
      exclude: [
        // Exclude internal signals/methods from controls panel
        'loading', 'data', 'error', 'displayData', 'service',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<SessionTimeoutComponent>;

// --- Default Story with Interaction Tests ---
export const Default: Story = {
  args: {
    userId: 'user-123',
    inactivityMinutes: 30,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // ════════════════════════════════════════════════════════
    //  VISUAL — Computed Styles
    // ════════════════════════════════════════════════════════
    await step('Visual', async () => {
      await step('Container styles', async () => {
        const container = canvasElement.querySelector('.container') as HTMLElement;
        const styles = window.getComputedStyle(container);
        const px = (val: string) => parseFloat(val.replace('px', ''));

        await expect(styles.borderRadius).toBe('12px');
        await expect(px(styles.paddingTop)).toBeCloseTo(24, 0);
      });

      // Add more visual assertions based on Figma spec
    });

    // ════════════════════════════════════════════════════════
    //  DATA — Content & Wording
    // ════════════════════════════════════════════════════════
    await step('Data', async () => {
      await step('Title renders translated text', async () => {
        const title = canvas.getByRole('heading');
        await expect(title).toBeTruthy();
        await expect(title.textContent!.trim().length).toBeGreaterThan(0);
      });

      // Add more data assertions based on Jira spec
    });

    // ════════════════════════════════════════════════════════
    //  INTERACTIONS — User Actions
    // ════════════════════════════════════════════════════════
    await step('Interactions', async () => {
      await step('Confirm button emits result', async () => {
        const confirmBtn = canvas.getByRole('button', { name: /confirm|stay/i });
        await userEvent.click(confirmBtn);
        // Verify output emission or state change
      });

      // Add more interaction tests based on Jira scenarios
    });
  },
};

// --- Additional State Stories (no play function needed) ---
export const Loading: Story = {
  // Story showing loading state
};

export const Error: Story = {
  // Story showing error state
};
```

## Story Rules

### Structure
- **One subdirectory per overlay** under `projects/storybook/src/stories/`
- **Story title** uses `Overlays/{PascalName}` pattern (controls Storybook sidebar grouping)
- **Import from public-api** (not direct file paths): `'../../../lib/session-timeout/public-api'`

### Meta Configuration
- **`component`:** The overlay content component
- **`decorators`:** Provide mock services via `applicationConfig({ providers: [...] })`
- **`argTypes`:** Define controls for inputs only (not internal state)
- **`parameters.controls.exclude`:** Exclude all internal signals, computed, and methods

### Mock Services in Stories
- Provide mock services at the DI level using `{ provide: ServiceClass, useValue: mockService }`
- Mock must implement the same interface as the real service
- Use `of()` from rxjs to return Observable values
- Include realistic data that matches the Figma design
- See `knowledge/conventions/mocking.md` for full mock conventions

### Interaction Tests (play function)
- Use the **three-section structure**: Visual → Data → Interactions
- **Visual:** Assert computed CSS styles (borderRadius, fontSize, padding, colors)
- **Data:** Assert rendered content (text, labels, dynamic values, translations)
- **Interactions:** Assert user actions (clicks, typing, form submission)
- Use `step()` to organize tests into logical groups
- Use `within(canvasElement)` for scoped queries
- Use `waitFor()` for async state changes
- Use `userEvent` (not `fireEvent`) for realistic user interactions

### The `px()` Helper
```typescript
const px = (val: string) => parseFloat(val.replace('px', ''));
```
Use this to compare computed pixel values with `toBeCloseTo()`.

### Storybook Configuration
- **main.ts** stories glob: `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'` — picks up nested files automatically
- **preview.ts** provides: HttpClient, TranslateService, locale switcher, theme switcher
- Translations and themes load automatically via the locale toolbar — no per-story setup needed

## Storybook Commands

```bash
# Start Storybook dev server
npm run storybook

# Build Storybook static
npm run storybook:build

# Run interaction tests
npm run test-storybook

# Full CI test (build + serve + test)
npm run storybook:test
```
