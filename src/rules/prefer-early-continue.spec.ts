import { RuleTester } from 'eslint'
import rule from './prefer-early-continue.js'

const ruleTester = new RuleTester()

ruleTester.run('prefer-early-continue', rule, {
  valid: [
    // ─── Early continue already used ──────────────────────────────────
    {
      name: 'early continue pattern already used in for-of',
      code: `
        for (const item of items) {
          if (!item.isActive) continue;
          validate(item);
          process(item);
          save(item);
        }
      `,
    },
    {
      name: 'early continue pattern already used in for loop',
      code: `
        for (let i = 0; i < items.length; i++) {
          if (!items[i]) continue;
          doA();
          doB();
        }
      `,
    },

    // ─── Short if (single statement) ──────────────────────────────────
    {
      name: 'single statement in if inside for-of loop',
      code: `
        for (const item of items) {
          if (item.isActive) {
            process(item);
          }
        }
      `,
    },
    {
      name: 'single statement in if inside for loop',
      code: `
        for (let i = 0; i < 10; i++) {
          if (i > 5) {
            doA();
          }
        }
      `,
    },
    {
      name: 'single statement in if inside while loop',
      code: `
        while (hasMore()) {
          if (x) {
            doA();
          }
        }
      `,
    },
    {
      name: 'if without braces in loop',
      code: `
        for (const item of items) {
          if (item) doSomething();
        }
      `,
    },
    {
      name: 'if with empty consequent block in loop',
      code: `
        for (const item of items) {
          if (item) {}
        }
      `,
    },

    // ─── If not last statement ────────────────────────────────────────
    {
      name: 'if not the last statement in loop',
      code: `
        for (const item of items) {
          if (item) {
            doA();
            doB();
          }
          doAfter();
        }
      `,
    },
    {
      name: 'multiple ifs in loop, wrapping if is not last',
      code: `
        for (const item of items) {
          if (item.a) {
            doA();
            doB();
          }
          if (item.b) {
            doC();
          }
        }
      `,
    },

    // ─── If-else (has else clause, no loop exit) ─────────────────────
    {
      name: 'if-else inside loop (has else clause, no loop exit)',
      code: `
        for (const item of items) {
          if (item) {
            doA();
            doB();
          } else {
            doC();
          }
        }
      `,
    },
    {
      name: 'if-else-if chain inside loop (no loop exit)',
      code: `
        for (const item of items) {
          if (item.a) {
            doA();
            doB();
          } else if (item.b) {
            doC();
          }
        }
      `,
    },

    // ─── Else with continue/break but if has single statement ───────
    {
      name: 'else with continue but if has only one statement',
      code: `
        for (const item of items) {
          if (item) {
            doA();
          } else {
            continue;
          }
        }
      `,
    },
    {
      name: 'else with break but if has only one statement',
      code: `
        for (const item of items) {
          if (item) {
            doA();
          } else {
            break;
          }
        }
      `,
    },

    // ─── Not inside a loop ───────────────────────────────────────────
    {
      name: 'wrapping if inside function (not loop - handled by prefer-early-return)',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          }
        }
      `,
    },
    {
      name: 'top-level if (not inside a loop)',
      code: `
        if (true) {
          doSomething();
          doMore();
        }
      `,
    },

    // ─── Inside nested non-loop blocks ───────────────────────────────
    {
      name: 'if inside try block inside loop',
      code: `
        for (const item of items) {
          try {
            if (item) {
              doA();
              doB();
            }
          } catch(e) {}
        }
      `,
    },
    {
      name: 'if inside nested function inside loop',
      code: `
        for (const item of items) {
          items.forEach(function(inner) {
            if (inner) {
              doA();
              doB();
            }
          });
        }
      `,
    },
  ],
  invalid: [
    // ─── for...of loop ───────────────────────────────────────────────
    {
      name: 'wrapping if as last statement in for-of loop',
      code: `
        for (const item of items) {
          if (item.isActive) {
            validate(item);
            process(item);
            save(item);
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },
    {
      name: 'wrapping if in for-of with statements before',
      code: `
        for (const item of items) {
          const val = transform(item);
          if (val) {
            doA(val);
            doB(val);
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },

    // ─── for loop ────────────────────────────────────────────────────
    {
      name: 'wrapping if as last statement in for loop',
      code: `
        for (let i = 0; i < items.length; i++) {
          if (items[i]) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },
    {
      name: 'wrapping if in for loop with complex condition',
      code: `
        for (let i = 0; i < 10; i++) {
          if (i % 2 === 0) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },

    // ─── for...in loop ──────────────────────────────────────────────
    {
      name: 'wrapping if as last statement in for-in loop',
      code: `
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            doA(key);
            doB(key);
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },

    // ─── while loop ─────────────────────────────────────────────────
    {
      name: 'wrapping if as last statement in while loop',
      code: `
        while (hasNext()) {
          if (condition) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },
    {
      name: 'wrapping if in while loop with statements before',
      code: `
        while (true) {
          const item = getNext();
          if (item) {
            process(item);
            save(item);
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },

    // ─── do...while loop ────────────────────────────────────────────
    {
      name: 'wrapping if as last statement in do-while loop',
      code: `
        do {
          if (condition) {
            doA();
            doB();
          }
        } while (hasMore());
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },

    // ─── Various condition types ────────────────────────────────────
    {
      name: 'wrapping if with AND condition in loop',
      code: `
        for (const item of items) {
          if (item.a && item.b) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },
    {
      name: 'wrapping if with negated condition in loop',
      code: `
        for (const item of items) {
          if (!item.disabled) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },
    {
      name: 'wrapping if with typeof check in loop',
      code: `
        for (const item of items) {
          if (typeof item === 'string') {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },

    // ─── Large if bodies ────────────────────────────────────────────
    {
      name: 'wrapping if with many statements in loop',
      code: `
        for (const item of items) {
          if (item) {
            doA();
            doB();
            doC();
            doD();
            doE();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },

    // ─── Nested loop contexts ───────────────────────────────────────
    {
      name: 'wrapping if in nested for-of loop',
      code: `
        for (const group of groups) {
          for (const item of group.items) {
            if (item.isActive) {
              validate(item);
              process(item);
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },
    {
      name: 'wrapping if in loop inside function',
      code: `
        function foo(items) {
          for (const item of items) {
            if (item) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyContinue' }],
    },

    // ─── Unnecessary else after continue ────────────────────────────
    {
      name: 'unnecessary else after continue in for-of',
      code: `
        for (const item of items) {
          if (item.skip) {
            continue;
          } else {
            process(item);
            save(item);
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
    {
      name: 'unnecessary else after continue in for loop',
      code: `
        for (let i = 0; i < items.length; i++) {
          if (!items[i]) {
            continue;
          } else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
    {
      name: 'unnecessary else after continue in while loop',
      code: `
        while (hasNext()) {
          if (shouldSkip()) {
            continue;
          } else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
    {
      name: 'unnecessary else after continue in do-while loop',
      code: `
        do {
          if (condition) {
            continue;
          } else {
            doA();
            doB();
          }
        } while (hasMore());
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
    {
      name: 'unnecessary else after continue in for-in loop',
      code: `
        for (const key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          } else {
            doA(key);
            doB(key);
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },

    // ─── Unnecessary else after break ───────────────────────────────
    {
      name: 'unnecessary else after break in for-of',
      code: `
        for (const item of items) {
          if (item.done) {
            break;
          } else {
            process(item);
            save(item);
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
    {
      name: 'unnecessary else after break in while loop',
      code: `
        while (true) {
          if (shouldStop()) {
            break;
          } else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },

    // ─── Labeled continue/break ─────────────────────────────────────
    {
      name: 'unnecessary else after labeled continue',
      code: `
        outer: for (const group of groups) {
          for (const item of group.items) {
            if (item.skip) {
              continue outer;
            } else {
              process(item);
              save(item);
            }
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
    {
      name: 'unnecessary else after labeled break',
      code: `
        outer: for (const group of groups) {
          for (const item of group.items) {
            if (item.done) {
              break outer;
            } else {
              process(item);
              save(item);
            }
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },

    // ─── Continue/break without braces ──────────────────────────────
    {
      name: 'unnecessary else after continue without braces',
      code: `
        for (const item of items) {
          if (item.skip)
            continue;
          else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },

    // ─── Else with single statement after continue/break ────────────
    {
      name: 'unnecessary else with single statement after continue',
      code: `
        for (const item of items) {
          if (item.skip) {
            continue;
          } else {
            process(item);
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },

    // ─── Not last statement: else still unnecessary after continue ──
    {
      name: 'unnecessary else after continue with code after if-else',
      code: `
        for (const item of items) {
          if (item.skip) {
            continue;
          } else {
            process(item);
          }
          save(item);
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },

    // ─── Else-if after continue ─────────────────────────────────────
    {
      name: 'unnecessary else-if after continue',
      code: `
        for (const item of items) {
          if (item.skip) {
            continue;
          } else if (item.isActive) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },

    // ─── Reverse: else has continue/break, if has 2+ statements ────
    {
      name: 'else with continue, if has multiple statements',
      code: `
        for (const item of items) {
          if (item.isActive) {
            validate(item);
            process(item);
          } else {
            continue;
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
    {
      name: 'else with break, if has multiple statements',
      code: `
        for (const item of items) {
          if (item.isLast) {
            process(item);
            finalize(item);
          } else {
            break;
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
    {
      name: 'else with labeled continue, if has multiple statements',
      code: `
        outer: for (const group of groups) {
          for (const item of group.items) {
            if (item.isActive) {
              validate(item);
              process(item);
            } else {
              continue outer;
            }
          }
        }
      `,
      errors: [{ messageId: 'unnecessaryElse' }],
    },
  ],
})
