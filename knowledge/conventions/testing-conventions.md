# Testing Conventions

This document defines the testing strategy for overlays. There are **two test types** with **strict boundaries**.

## Test Type Boundaries

| Concern | Unit Tests (Jest) | Interaction Tests (Storybook) |
|---------|-------------------|-------------------------------|
| Component creation | ✅ | ❌ |
| Service method calls | ✅ | ❌ |
| State transitions | ✅ | ❌ |
| Input/output binding | ✅ | ❌ |
| Error handling | ✅ | ❌ |
| Edge cases | ✅ | ❌ |
| CSS visual accuracy | ❌ | ✅ |
| Content rendering | ❌ | ✅ |
| User interactions | ❌ | ✅ |
| Theme switching | ❌ | ✅ |
| Translation display | ❌ | ✅ |

> **Translation testing note:** Translation *rendering* (text appears for each locale) is tested in Storybook interaction tests by switching the locale toolbar. Translation *loading* (service fetches correct JSON) is tested in unit tests for `TranslationService`. Overlay unit tests do NOT need to test translation display.

**Key principle:** Jest tests verify **behavior** (did the right thing happen?). Storybook tests verify **appearance and experience** (does it look right? does it feel right?).

## Unit Tests (Jest)

### File Location
`projects/lib/{overlay-name}/{overlay-name}.component.spec.ts`

### Template

```typescript
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { SessionTimeoutComponent } from './session-timeout.component';
import { SessionTimeoutService } from './session-timeout.service';

describe('SessionTimeoutComponent', () => {
  let component: SessionTimeoutComponent;
  let fixture: ComponentFixture<SessionTimeoutComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTimeoutComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionTimeoutComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Flush any HTTP calls made on init
    const req = httpMock.expectOne('/api/session/user-123');
    req.flush(mockData);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ... more tests
});
```

### What to Test in Unit Tests

1. **Component creation** — basic `should create` test
2. **Service integration** — verify correct API calls are made with correct params
3. **State transitions** — loading → success, loading → error, error → retry
4. **Input effects** — changing inputs triggers correct behavior
5. **Output emission** — actions emit correct result objects
6. **Edge cases** — empty data, error responses, timeout, invalid input
7. **Computed state** — derived signals compute correctly

### Unit Test Rules

- Use `HttpTestingController` for HTTP mocking (not service-level mocks)
- Always call `httpMock.verify()` in `afterEach` to ensure no unexpected requests
- Use `fixture.detectChanges()` after state changes to trigger change detection
- Test **behavior**, not appearance — no CSS/style assertions
- Group tests by concern: creation, state, inputs, outputs, edge cases
- Use descriptive test names: `'should show error state on HTTP failure'`

### Running Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Interaction Tests (Storybook)

### File Location
`projects/storybook/src/stories/{overlay-name}/{overlay-name}.stories.ts`

### What to Test in Interaction Tests

1. **Visual accuracy** — CSS properties match Figma spec (dimensions, colors, spacing, typography)
2. **Content rendering** — text, labels, dynamic values render correctly
3. **User interactions** — clicks, typing, form submission work correctly
4. **State display** — all visual states render correctly (loading, error, empty, success)
5. **Theme switching** — component looks correct under each banner theme
6. **Translation display** — translated text renders for each locale

### Interaction Test Structure (play function)

```typescript
play: async ({ canvasElement, step }) => {
  const canvas = within(canvasElement);

  await step('Visual', async () => {
    // Assert CSS computed styles
    // Use px() helper for pixel values
    // Check borderRadius, fontSize, padding, colors, layout
  });

  await step('Data', async () => {
    // Assert rendered text content
    // Check translations loaded
    // Verify dynamic data displays correctly
  });

  await step('Interactions', async () => {
    // Click buttons, type in inputs
    // Verify state changes
    // Check output emissions (via DOM changes)
  });
}
```

### Interaction Test Rules

- Use `storybook/test` imports: `expect, userEvent, waitFor, within`
- Use `step()` to organize into Visual → Data → Interactions
- Use `within(canvasElement)` for scoped DOM queries
- Use `userEvent` (not `fireEvent`) for realistic interactions
- Use `waitFor()` for async assertions
- Use `px()` helper + `toBeCloseTo()` for pixel value comparisons
- Test **appearance and behavior**, not service internals

### Running Interaction Tests

```bash
# Start Storybook (manual testing)
npm run storybook

# Run automated interaction tests
npm run test-storybook
```
