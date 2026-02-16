---
displayNumber: 2
status: in-progress
priority: 1
createdAt: 2026-02-16T14:16:06.038572+00:00
updatedAt: 2026-02-16T14:20:59.297074+00:00
---

# Add prefer-early-continue rule for loops

Add a new rule that detects wrapping if blocks inside loops and suggests using continue to reduce nesting — the loop equivalent of early return.

**Bad:**

```javascript
for (const item of items) {
  if (item.isActive) {
    validate(item)
    process(item)
    save(item)
  }
}
```

**Good:**

```javascript
for (const item of items) {
  if (!item.isActive) continue
  validate(item)
  process(item)
  save(item)
}
```

Should work for all loop types: for, for…of, for…in, while, do…while. Detection criteria: an if statement is the last statement in a loop body, has no else clause, and the if body contains 2+ statements.
