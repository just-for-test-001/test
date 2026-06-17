# Mocking Conventions

This document defines how to create and use mocks for external services in the overlays library.

## Mock Strategy

**Service-Level Mocks (DI Replacement):** Replace real services at the Angular DI level in Storybook providers. The component doesn't know it's mocked.

## When to Mock

- **Storybook stories:** ALWAYS mock external services (API calls, redirects, etc.).
  > **Note:** The existing `posts.stories.ts` makes real HTTP calls to a public API (jsonplaceholder). This is acceptable for public/demo APIs. For production overlays with private Rexel APIs, always mock.
- **Unit tests:** Use `HttpTestingController` (not service-level mocks) for HTTP-level control
- **MFE integration:** No mocking — real services run in production

## Creating a Mock Service

### Step 1: Define the Mock Object

The mock must satisfy the same TypeScript interface as the real service:

```typescript
import { of, throwError } from 'rxjs';

import { SessionTimeoutService } from './session-timeout.service';

// --- Success mock ---
const mockSessionTimeoutService: Partial<SessionTimeoutService> = {
  getData: (userId: string) => of({
    userId,
    lastActivity: '2024-01-15T10:30:00Z',
    cartItemCount: 3,
  }),
};

// --- Error mock ---
const mockSessionTimeoutServiceError: Partial<SessionTimeoutService> = {
  getData: (userId: string) => throwError(() => new Error('API unavailable')),
};
```

### Step 2: Provide in Story Decorators

```typescript
import { applicationConfig } from '@storybook/angular';

const meta: Meta<SessionTimeoutComponent> = {
  component: SessionTimeoutComponent,
  decorators: [
    applicationConfig({
      providers: [
        { provide: SessionTimeoutService, useValue: mockSessionTimeoutService },
      ],
    }),
  ],
};
```

### Step 3: Create Stories for Each State

```typescript
// Default (success) state
export const Default: Story = {
  args: { userId: 'user-123' },
  play: async ({ canvasElement, step }) => { /* interaction tests */ },
};

// Error state
export const Error: Story = {
  args: { userId: 'user-123' },
  decorators: [
    applicationConfig({
      providers: [
        { provide: SessionTimeoutService, useValue: mockSessionTimeoutServiceError },
      ],
    }),
  ],
};
```

## Mock Rules

1. **Type-safe:** Prefer implementing the full service interface. `Partial<ServiceType>` works but won't catch missing method errors at the mock definition site.
2. **Realistic data:** Mock data must match the real API response structure exactly
3. **Cover all states:** Create mock variants for success, error, loading, and empty states
4. **Use `of()` for success:** Return Observables with `of()` from rxjs
5. **Use `throwError()` for errors:** Return error Observables with `throwError()`
6. **Match Figma design:** Mock data values should match what's shown in the Figma mockup
7. **Don't export mocks:** Mocks are Storybook-only — they stay in the story file

## Mock Data Patterns

### Inline Mock (simple)
```typescript
const mockService = {
  getData: () => of({ id: '1', name: 'Test' }),
};
```

### Separate Mock Data (complex)
For overlays with complex data, create mock data objects at the top of the story file:

```typescript
const mockCartData = {
  items: [
    { id: 'item-1', name: 'Wire Cable 100m', quantity: 2, price: 45.99 },
    { id: 'item-2', name: 'Circuit Breaker 20A', quantity: 1, price: 12.50 },
  ],
  totalItems: 3,
  totalPrice: 104.48,
  currency: 'EUR',
};

const mockCartService = {
  getCart: (userId: string) => of(mockCartData),
  updateQuantity: (itemId: string, qty: number) => of({ success: true }),
};
```

### Multi-State Mock
When you need different responses for different scenarios:

```typescript
function createMockService(scenario: 'success' | 'error' | 'empty') {
  switch (scenario) {
    case 'success':
      return { getData: () => of(mockData) };
    case 'error':
      return { getData: () => throwError(() => new Error('Failed')) };
    case 'empty':
      return { getData: () => of(null) };
  }
}
```

## What to Mock

| External Dependency | How to Mock |
|---------------------|-------------|
| HTTP API calls | Service-level mock returning `of(data)` |
| Redirects/navigation | Mock router service with `navigate` spy |
| Browser APIs (localStorage, etc.) | Mock in service or use jest.fn() |
| Third-party SDKs | Mock the wrapper service |
| Window.location | Avoid directly — use a service abstraction |

## What NOT to Mock

- **Internal component state** — signals, computed values
- **Pure functions** — test them directly
- **Angular built-in services** — FormsModule, TranslateService (use real providers)
- **CSS/styles** — tested via Storybook interaction tests, not mocks
