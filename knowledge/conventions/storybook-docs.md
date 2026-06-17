# Storybook Documentation (MDX)

This document defines how to write `.mdx` documentation pages for overlays in Storybook.

## When to Create

MDX documentation is **optional — Phase 2**. Create it after the overlay is validated and integrated. The pipeline Step 10 covers this.

## File Location

`projects/storybook/src/stories/{overlay-name}/{overlay-name}.mdx`

## Template

````mdx
import { Meta, Title, Primary, Controls, Story, Canvas } from "@storybook/blocks";

import * as SessionTimeoutStories from "./session-timeout.stories";

<Meta of={SessionTimeoutStories} title="Overlays/Session Timeout/Docs" />

# Session Timeout Modal

Brief description of what this overlay does and when it appears.

## When to Use

- After 30 minutes of user inactivity
- When the session is about to expire
- NOT for forced logouts (use the redirect flow instead)

## Behavior

### User Actions

| Action                     | Result                                      |
| -------------------------- | ------------------------------------------- |
| Click "Stay signed in"     | Session extends by 30 minutes, modal closes |
| Click "Sign out"           | User redirected to login page               |
| Countdown reaches 0        | Automatic sign-out                          |
| Press ESC / click backdrop | Same as "Sign out"                          |

### API Calls

| Endpoint                    | Method | When                               |
| --------------------------- | ------ | ---------------------------------- |
| `GET /api/session/{userId}` | GET    | On modal open — fetch session info |
| `POST /api/session/extend`  | POST   | On "Stay signed in" click          |

## Component API

### Inputs

| Input               | Type     | Required | Default | Description                     |
| ------------------- | -------- | -------- | ------- | ------------------------------- |
| `userId`            | `string` | Yes      | —       | Current user ID                 |
| `inactivityMinutes` | `number` | No       | `30`    | Inactivity threshold in minutes |

### Outputs

| Output   | Payload                                                                           | Description                        |
| -------- | --------------------------------------------------------------------------------- | ---------------------------------- |
| `result` | `{ action: 'confirm' \| 'cancel' \| 'dismiss', payload?: { extended: boolean } }` | Emitted when user makes a decision |

### Usage in MFE

```typescript
import { SessionTimeoutComponent } from "mf-overlays-lib/session-timeout";

@Component({
  template: `
    @if (showSessionTimeout()) {
      <lib-session-timeout [userId]="userId()" [inactivityMinutes]="30" (result)="onSessionResult($event)" />
    }
  `,
  imports: [SessionTimeoutComponent],
})
export class ShellComponent {
  showSessionTimeout = signal(false);

  onSessionResult(result: SessionTimeoutResult): void {
    if (result.action === "confirm") {
      // Session extended — close modal, reset timer
      this.showSessionTimeout.set(false);
    } else {
      // User chose to sign out or was dismissed
      this.authService.signOut();
    }
  }
}
```
````

## Design System Components Used

| DS Component         | Usage                         |
| -------------------- | ----------------------------- |
| Button (primary)     | "Stay signed in" action       |
| Button (secondary)   | "Sign out" action             |
| Typography (heading) | Modal title                   |
| Typography (body)    | Explanatory text              |
| Spinner              | Loading state during API call |

## Resources

- **Figma:** [Session Timeout Design](https://www.figma.com/design/xyz123)
- **Jira:** OVERLAY-42
- **API Documentation:** Link to API docs if available

## Business Logic

The overlay manages its own session lifecycle:

1. **On open:** Fetches current session info via API
2. **Countdown:** Starts a timer counting down from `inactivityMinutes`
3. **Extend:** Calls the extend API, emits `{ action: 'confirm' }` on success
4. **Expire:** Auto-signs out when countdown reaches zero
5. **Error handling:** Shows retry option if API calls fail

```

## Documentation Sections

Every MDX doc should include these sections:

| Section | Required | Content |
|---------|----------|---------|
| Title & Description | Yes | What the overlay does |
| When to Use | Yes | Trigger conditions and non-cases |
| Behavior | Yes | User actions → outcomes table |
| API Calls | If applicable | Endpoints, methods, when called |
| Component API | Yes | Inputs table, Outputs table |
| Usage in MFE | Yes | Code example showing integration |
| DS Components Used | Yes | Table of design system components |
| Resources | Yes | Figma URL, Jira ticket number |
| Business Logic | If applicable | Flow description for complex overlays |

## Writing Guidelines

- **Be concise.** Developers skim docs, they don't read them word-by-word.
- **Use tables** for structured data (inputs, outputs, actions).
- **Include code examples** that show real MFE integration patterns.
- **Document business logic** from the Jira spec — explain the flow, not just the code.
- **Link to specs** — Figma URL and Jira ticket should always be included.
- **Keep it current** — update docs when the overlay changes.
```
