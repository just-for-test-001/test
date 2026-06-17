# Jira Guide

This document teaches the AI agent how to understand Jira ticket specifications and use them to implement overlays.

## Overview

Each overlay has a corresponding Jira ticket saved as `jira.md` in the overlay's `_specs/` folder. The Jira spec drives the **business logic, scenarios, testing, and documentation** of the overlay.

## Jira Spec Structure

A typical `jira.md` file contains:

```markdown
# OVERLAY-42: Session Timeout Modal

## Context

After 30 minutes of user inactivity, display a modal warning the user
that their session will expire. The user can choose to extend the session
or sign out.

## Scenarios

### Scenario 1: Session about to expire

- **Given** the user has been inactive for 30 minutes
- **When** the inactivity timer reaches the threshold
- **Then** the session timeout modal appears with a countdown
- **And** the user sees "Stay signed in" and "Sign out" buttons

### Scenario 2: User extends session

- **Given** the session timeout modal is displayed
- **When** the user clicks "Stay signed in"
- **Then** the session is extended by 30 minutes
- **And** the modal closes
- **And** the inactivity timer resets

### Scenario 3: User signs out

- **Given** the session timeout modal is displayed
- **When** the user clicks "Sign out"
- **Then** the user is redirected to the login page
- **And** the session is terminated

### Scenario 4: Countdown reaches zero

- **Given** the session timeout modal is displayed
- **When** the countdown reaches 00:00
- **Then** the user is automatically signed out
- **And** the modal closes

## Trigger

- **Type:** Timed (inactivity-based)
- **Condition:** 30 minutes of inactivity
- **Source:** Shell MFE inactivity detector

## API

- **Extend session:** `POST /api/session/extend` → `{ success: boolean, newExpiry: string }`
- **Get session info:** `GET /api/session/{userId}` → `{ userId, lastActivity, expiryTime }`

## Inputs (from MFE)

- `userId: string` — Current user ID
- `inactivityMinutes: number` — Inactivity threshold (default: 30)

## Outputs (to MFE)

- `{ action: 'confirm', payload: { extended: true } }` — User chose to stay
- `{ action: 'cancel' }` — User chose to sign out
- `{ action: 'dismiss' }` — Modal was dismissed (countdown expired)

## Design System Components Used

- Modal (shell, provided by MFE)
- Button (primary: "Stay signed in", secondary: "Sign out")
- Typography (heading, body text, countdown display)
- Spinner (loading state during session extension)

## Figma URL

https://www.figma.com/design/xyz123/Session-Timeout

## Acceptance Criteria

- [ ] Modal appears after exactly 30 minutes of inactivity
- [ ] Countdown displays minutes:seconds remaining
- [ ] "Stay signed in" extends session and closes modal
- [ ] "Sign out" redirects to login
- [ ] Auto sign-out when countdown reaches zero
- [ ] Translations work for all 4 locales
- [ ] Theme colors change per banner
```

## How to Extract Information

### Context Section

Provides the **why** — the business reason for the overlay. Use this to understand the overlay's purpose and write meaningful documentation.

### Scenarios Section

Provides the **what** — the expected behavior. Each scenario maps to:

- **Unit test cases** (behavior verification)
- **Interaction test cases** (user flow verification)
- **Story variants** (one story per major scenario or state)

### Scenario Format (Given/When/Then)

- **Given:** The initial state → defines mock data setup and component inputs
- **When:** The user action → defines interaction test steps
- **Then:** The expected outcome → defines assertions

### Trigger Section

Defines **how the overlay opens**:

- **Instant:** MFE opens it immediately on user action (button click, etc.)
- **Timed:** Opens after a delay or condition (inactivity timer, etc.)

The trigger type affects the story setup — timed triggers may need a mock timer or countdown display.

### API Section

Lists all API endpoints the overlay needs. The agent must:

1. Create service methods for each endpoint
2. Define request/response types in the model file
3. Create mock implementations for Storybook
4. Handle success and error responses

### Inputs/Outputs Sections

Define the contract between MFE and overlay. The agent must:

1. Create `input()` properties matching the inputs
2. Create `output()` property emitting the result type
3. Wire inputs to service calls
4. Wire UI actions to output emissions

### Design System Components Used

Lists which DS components appear in the overlay. The agent uses this to:

1. Structure the template with correct semantic HTML/CSS classes
2. Apply the right CSS patterns (button variants, card layouts, etc.)
3. Verify against the Figma node types

### Acceptance Criteria

Checklist items that map directly to:

- Unit test cases
- Interaction test assertions
- Documentation sections

## Mapping Jira to Implementation

| Jira Section        | Implementation Target                        |
| ------------------- | -------------------------------------------- |
| Context             | Component JSDoc, story description, MDX docs |
| Scenarios           | Unit tests + interaction tests               |
| API                 | Service methods + model types                |
| Inputs              | Component `input()` properties               |
| Outputs             | Component `output()` property + result type  |
| DS Components       | Template structure + CSS classes             |
| Acceptance Criteria | Test assertions checklist                    |
| Trigger             | Story configuration + MFE integration guide  |

## Common Patterns

### Modal with API Call

```
Jira: "Fetch cart data and display items"
→ Service: getCart(userId) → Observable<CartData>
→ Component: loading signal, data signal, error signal
→ Template: @if(loading()) skeleton, @else if(error()) error state, @else content
→ Story: mock service returning data + error mock
```

### Modal with Form Input

```
Jira: "User enters quantity and confirms"
→ Template: Input/QuantitySelector + Confirm/Cancel buttons
→ Component: formValue signal, validation computed
→ Output: { action: 'confirm', payload: { value: formValue() } }
→ Story: interaction test typing and submitting
```

### Modal with Confirmation

```
Jira: "Confirm deletion of item"
→ Template: Warning message + Confirm/Cancel buttons
→ Component: minimal state (item passed as input)
→ Output: { action: 'confirm' } or { action: 'cancel' }
→ Story: two stories — confirm click and cancel click
```
