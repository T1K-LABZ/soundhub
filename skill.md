---
name: coding-guidelines
description: Core coding standards for this project. Use this whenever making any changes to code — new files, edits, refactors, explanations, or reviews. Always follow these rules without being asked.
---

# Coding Guidelines

These rules apply to **every change**, big or small. No exceptions.

---

## 1. Keep Files Short — 300 Lines Max

A file is like a toolbox. A toolbox with 1000 tools is useless — you can't find anything.  
Each file should do **one thing** and stay **under 300 lines**.

- If you're approaching 300 lines, split the file.
- Extract helpers, utilities, or sub-components into their own files.
- Name the new file clearly so its purpose is obvious.

```
// ❌ bad — one giant file doing everything
userController.ts  (650 lines)

// ✅ good — split by responsibility
userController.ts   (120 lines)
userValidator.ts    ( 80 lines)
userHelpers.ts      ( 60 lines)
```

---

## 2. Feature-Based (Domain-Based) Folder Structure — Vertical Slicing

Think of the codebase like a hospital — organized by **ward** (Pediatrics, Cardiology, Emergency), not by **job type** (all doctors in one room, all nurses in another). Each ward has its own doctor, nurse, and equipment together.

This project uses **feature-based (domain-based) folder structure**, also called **vertical slicing**. Every file that belongs to a feature lives together in one folder, regardless of its technical role.

```
// ❌ bad — horizontal slicing (grouped by technical type)
/controllers
  inventory.controller.ts
  sales.controller.ts
/routes
  inventory.routes.ts
  sales.routes.ts
/services
  inventory.service.ts
  sales.service.ts

// ✅ good — vertical slicing (grouped by feature/domain)
/inventory
  inventory.controller.ts
  inventory.routes.ts
  inventory.service.ts
  inventory.validation.ts
/sales
  sales.controller.ts
  sales.routes.ts
  sales.service.ts
  sales.validation.ts
```

### Rules for feature folders:

- Folder name matches the domain — `inventory/`, `sales/`, `mpesa/`, `shifts/`, etc.
- Every feature folder contains **all** its related files: controller, routes, service, validation, types, helpers, and — when needed — a data file (see Rule 8).
- Files inside a folder talk to each other or to shared `utils/` — they don't reach into other feature folders directly.
- Shared logic that is used across multiple features goes in a top-level `utils/` or `shared/` folder.
- **Don't pre-emptively create folders.** If a feature only has one file, keep it flat. The folder earns its place once there are multiple files.

```
// ✅ correct top-level structure
/src
  /inventory
    inventory.controller.ts
    inventory.routes.ts
    inventory.service.ts
    inventory.validation.ts
  /sales
    sales.controller.ts
    sales.routes.ts
    sales.service.ts
    sales.validation.ts
  /utils
    date.utils.ts
    response.utils.ts
  app.ts
  server.ts
```

---

## 3. No Redundancy — Don't Repeat Yourself

Code duplication is like photocopying a bug — now you have two bugs.  
If you write the same logic twice, extract it.

- Reuse existing functions instead of rewriting them.
- Before adding something new, check if it already exists.
- Shared logic lives in a `utils/` or `helpers/` file.

```ts
// ❌ bad — same logic in two places
function getUserAge(user: User) {
  return new Date().getFullYear() - user.birthYear;
}
function getMemberAge(member: Member) {
  return new Date().getFullYear() - member.birthYear;
}

// ✅ good — one function, used everywhere
function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}
```

---

## 4. Simple and Stupid (KISS)

The best code reads like plain English. If you need a diagram to explain one function, it's too complex.  
Think of it like IKEA instructions — each step should be obvious without a manual.

- Prefer clear over clever.
- Short functions that do one thing.
- Avoid deep nesting — if you're 4 levels in, refactor.
- Use descriptive names; avoid abbreviations.

```ts
// ❌ bad — clever but confusing
const r = arr.reduce((a, c) => ({ ...a, [c.id]: c }), {});

// ✅ good — obvious at a glance
const usersById: Record<string, User> = {};
for (const user of users) {
  usersById[user.id] = user;
}
```

---

## 5. Comments — Small, Useful, Not Everywhere

Comments are like spices — a little goes a long way. Over-commenting is noise.

**Comment the _why_, not the _what_.**  
The code shows what's happening. Comments explain why it had to be this way.

```ts
// ❌ bad — states the obvious
i++; // increment i by 1

// ✅ good — explains a non-obvious decision
// API returns dates in UTC; convert to local time before display
const localDate = toLocalTime(apiResponse.createdAt);
```

Rules:

- One short comment per logical block, not per line.
- If a function name already explains the intent, skip the comment.
- Use `// TODO:` for things left to fix, `// NOTE:` for important context.

---

## 6. When Explaining Code — Use Analogies

When describing how something works or why a pattern matters, use a real-world analogy first, then show the code.

Examples of good explanation style:

> "Middleware is like airport security — every passenger (request) goes through it before boarding (reaching the route handler)."

> "A cache is like a sticky note on your monitor — faster to check than opening the filing cabinet every time."

> "An event listener is like a doorbell — you don't stand at the door watching; you just respond when it rings."

This applies to:

- Inline explanations in comments
- PR descriptions
- Any explanation written alongside code changes

---

## 7. Git — Never Create New Branches

Think of the current branch like the lane you're already driving in — stay in it. Don't merge into a new lane just to make a small move.

- **Always work on the current branch.** Never create a new branch unless explicitly asked.
- Do not auto-generate branch names like `claude/some-random-name-abc123`.
- If a task requires branching, ask the user which branch to use — don't decide on your own.

```bash
# ❌ bad — creating unsolicited branches
git checkout -b claude/cranky-tereshkova-29210e

# ✅ good — staying on the current branch
git add .
git commit -m "fix: update user validation logic"
```

---

## 8. Static Data Files — Keep Pages AI-Ready

Think of a page's static data like a script for an actor. Right now the actor reads from a printed page (`*.data.ts`). Later, when the real API is ready, you hand them a live earpiece (`*.service.ts`) instead. The actor (the page/component) doesn't change — only where they get their lines from.

**When a page or component uses hardcoded/static data, that data must live in a dedicated `[feature].data.ts` file — never inline inside the component or page.**

This rule exists so that when an AI service or real API is connected, only the data file needs to change. The page/component stays untouched.

### Naming convention

```
[feature].data.ts
```

Examples:

```
zones.data.ts
inventory.data.ts
dashboard.data.ts
```

### Where the file lives

Inside the feature folder, alongside the other feature files:

```
/zones
  zones.page.tsx          ← renders the UI, imports from zones.data.ts
  zones.service.ts        ← (future) real API calls go here
  zones.data.ts           ← ALL static/mock data lives here
  zones.types.ts
  zones.validation.ts
```

### What goes in a `*.data.ts` file

Every piece of hardcoded data the page uses:

- Lists of items displayed in the UI (zones, users, orders, etc.)
- Dropdown options, filter options, tab labels
- Stat cards, KPI values used for display
- Chart data (labels, datasets)
- Any `const` array or object that a real API would eventually return

```ts
// ✅ zones.data.ts

import type { Zone, DeliveryPerson } from './zones.types';

export const ZONES: Zone[] = [
  { id: '1', name: 'Kilimani', orders: 324, rating: 4.5 },
  { id: '2', name: 'Westlands', orders: 289, rating: 4.3 },
  { id: '3', name: 'Lavington', orders: 198, rating: 4.7 },
];

export const DELIVERY_TEAM: DeliveryPerson[] = [
  { id: '1', name: 'Mike Johnson', phone: '+254 700 111222', status: 'available', deliveriesToday: 8 },
  { id: '2', name: 'James Smith',  phone: '+254 700 333444', status: 'busy',      deliveriesToday: 6 },
  { id: '3', name: 'Paul Anderson',phone: '+254 700 555666', status: 'available', deliveriesToday: 5 },
];

export const WEEKLY_PERFORMANCE = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: {
    kilimani: [46, 52, 47, 61, 64, 72, 58],
  },
};
```

### What the page/component does

The page imports from `*.data.ts` and uses it exactly as it would use API data. No hardcoded values inside the component.

```ts
// ✅ zones.page.tsx

import { ZONES, DELIVERY_TEAM, WEEKLY_PERFORMANCE } from './zones.data';

// Uses the data just like it came from an API call
const zones = ZONES;
const team = DELIVERY_TEAM;
```

### Switching from static to live API

When the real API is ready, the swap is a one-file change:

```ts
// Before — zones.data.ts (static)
export const ZONES: Zone[] = [
  { id: '1', name: 'Kilimani', orders: 324, rating: 4.5 },
  ...
];

// After — zones.service.ts (live)
export async function getZones(): Promise<Zone[]> {
  const response = await api.get('/zones');
  return response.data;
}
```

The page only changes its import — the rendering logic stays identical.

### Rules

- **Never** hardcode data inline inside a component or page — use a `*.data.ts` file.
- **One data file per feature** — don't scatter static values across multiple files.
- **Use real TypeScript types** in the data file — the same types the API response will eventually use.
- The data file is the **only** file that changes when you connect a real API or AI service.
- If a value is a UI constant that will never come from an API (e.g. a colour map, a label string), it goes in a `*.constants.ts` file instead, not the data file.

```
// ✅ right separation
zones.data.ts       ← data that will come from an API (zones list, team, stats)
zones.constants.ts  ← UI-only values that never change (status colour map, tab labels)
```

---

## Quick Checklist Before Any Change

Before committing or finishing a task, verify:

- [ ] No file exceeds 300 lines
- [ ] New files are placed in the correct feature folder (vertical slicing — not grouped by type)
- [ ] No logic is duplicated from elsewhere in the codebase
- [ ] Functions are short and do one thing
- [ ] Comments explain _why_, not _what_
- [ ] Variable and function names are readable out loud
- [ ] If explaining something, an analogy is used to ground the concept
- [ ] No new branch was created unless explicitly requested by the user
- [ ] Static/hardcoded data lives in a `[feature].data.ts` file, not inline in the component

---

_Simple code is not lazy code — it's the hardest kind to write and the easiest to maintain._