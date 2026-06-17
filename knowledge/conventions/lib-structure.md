# Library Structure & Conventions

This document defines how to create a new overlay (modal or sidepanel content component) in `projects/lib/`.

## Folder Structure

Each overlay is a **flat folder** inside `projects/lib/` with a **kebab-case** feature name:

```
projects/lib/
  {overlay-name}/
    {overlay-name}.component.ts        # Content component (standalone, OnPush)
    {overlay-name}.service.ts           # Business logic, API calls, state
    {overlay-name}.model.ts             # Interfaces, types, enums
    {overlay-name}.component.spec.ts    # Unit tests (Jest)
    public-api.ts                       # Barrel export
    ng-package.json                     # ng-packagr entry config
    _specs/                             # Figma JSON + Jira markdown (not published)
      figma.json
      jira.md
```

### Naming Rules

| Item            | Convention               | Example                        |
| --------------- | ------------------------ | ------------------------------ |
| Folder name     | kebab-case               | `session-timeout/`             |
| Component file  | `{name}.component.ts`    | `session-timeout.component.ts` |
| Component class | PascalCase + `Component` | `SessionTimeoutComponent`      |
| Selector        | `lib-{kebab-name}`       | `lib-session-timeout`          |
| Service file    | `{name}.service.ts`      | `session-timeout.service.ts`   |
| Service class   | PascalCase + `Service`   | `SessionTimeoutService`        |
| Model file      | `{name}.model.ts`        | `session-timeout.model.ts`     |
| Storybook title | `Overlays/{PascalName}`  | `Overlays/SessionTimeout`      |

## Component Template

```typescript
import { ChangeDetectionStrategy, Component, input, output, inject, signal, computed, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";

import { SessionTimeoutService } from "./session-timeout.service";
import { SessionTimeoutResult } from "./session-timeout.model";

@Component({
  selector: "lib-session-timeout",
  imports: [TranslatePipe],
  template: ` <!-- Component template here --> `,
  styles: `
    /* Use CSS custom properties for theming: var(--primary), var(--surface), etc. */
    /* All colors, fonts, spacing MUST use theme tokens, never hardcoded values */
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTimeoutComponent {
  // --- Injected services ---
  private readonly service = inject(SessionTimeoutService);

  // --- Inputs (from MFE) ---
  readonly userId = input.required<string>();
  readonly inactivityMinutes = input(30);

  // --- Outputs (to MFE) ---
  readonly result = output<SessionTimeoutResult>();

  // --- Internal state (signals) ---
  readonly loading = signal(true);
  readonly data = signal<SomeType | null>(null);
  readonly error = signal(false);

  // --- Derived state (computed) ---
  readonly displayData = computed(() => {
    const d = this.data();
    return d ? /* transform */ d : null;
  });

  constructor() {
    // Load data on init — use takeUntilDestroyed() for automatic cleanup
    this.loadData();
  }

  protected onAction(): void {
    this.result.emit({ action: "confirm", payload: { extended: true } });
  }

  private loadData(): void {
    this.service
      .getData(this.userId())
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.data.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }
}

// For timed overlays (countdowns, inactivity timers), use RxJS timer/interval:
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { interval, takeWhile, map } from 'rxjs';
//
// readonly remainingSeconds = signal(0);
//
// startCountdown(totalSeconds: number): void {
//   interval(1000).pipe(
//     takeUntilDestroyed(),
//     map(tick => totalSeconds - tick - 1),
//     takeWhile(remaining => remaining >= 0),
//   ).subscribe(remaining => {
//     this.remainingSeconds.set(remaining);
//     if (remaining === 0) this.onExpired();
//   });
// }
```

## Service Template

```typescript
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

import { SomeData } from "./session-timeout.model";

@Injectable({ providedIn: "root" })
export class SessionTimeoutService {
  private readonly http = inject(HttpClient);

  getData(userId: string): Observable<SomeData> {
    return this.http.get<SomeData>(`/api/session/${userId}`);
  }
}
```

### Service Rules

- **Self-contained:** Each overlay owns its services completely. No shared services layer.
- **`providedIn: 'root'`:** Always use root provider for singleton services.
- **`inject()` function:** Never use constructor injection.
- **`shareReplay(1)`:** Use for data fetched once and shared across subscribers.
- **Return `Observable`:** Services return Observables, components subscribe in constructor/init.
- **No business logic in components:** API calls, data transformation, and business rules belong in the service.

## Model Template

```typescript
/** Result emitted by the overlay to the MFE */
export interface SessionTimeoutResult {
  action: "confirm" | "cancel" | "dismiss";
  payload?: { extended: boolean };
}

/** Data fetched from API */
export interface SessionData {
  userId: string;
  lastActivity: string;
  cartItemCount: number;
}
```

## public-api.ts

```typescript
export * from "./session-timeout.component";
export * from "./session-timeout.model";
// Export the service ONLY if external consumers (MFE, Storybook) need the type
// for DI mocking or direct usage. If the service is purely internal, omit it.
export * from "./session-timeout.service";
```

## ng-package.json

```json
{
  "lib": {
    "entryFile": "public-api.ts"
  }
}
```

## Input/Output Contract

### Inputs (MFE → Overlay)

- Use `input()` function (not decorator)
- Use `input.required<T>()` for mandatory inputs
- Inputs are **identifiers** (userId, cartId) + **configuration** (timeout, display options)
- The overlay fetches its own data — do NOT pass pre-fetched domain objects

### Outputs (Overlay → MFE)

- Use `output()` function (not decorator)
- Emit a typed result object: `{ action: 'confirm' | 'cancel' | 'dismiss', payload?: T }`
- Actions are **decisions**, not domain objects
- The MFE reacts to the decision (close modal, redirect, refresh data)

### Common Output Actions

| Action    | Meaning                                        |
| --------- | ---------------------------------------------- |
| `confirm` | User confirmed the primary action              |
| `cancel`  | User clicked cancel/secondary action           |
| `dismiss` | User dismissed (ESC, backdrop click, X button) |

## CSS & Theming Rules

- **ALWAYS** use CSS custom properties: `var(--primary)`, `var(--surface)`, `var(--textPrimary)`, etc.
- **NEVER** hardcode colors, font families, or spacing values
- Use `transition: background 0.3s ease, color 0.3s ease` for smooth theme switching
- Use `:host { display: block; }` as the base host style
- Prefix overlay-specific classes with the overlay name if needed to avoid collisions

## Translation Rules

- Use `TranslatePipe` in templates: `{{ 'KEY' | translate }}`
- Translation keys are defined per locale in `projects/lib/assets/i18n/{banner}_{lang}.json`
- See `knowledge/conventions/translations.md` for full translation conventions
