import { RuleTester } from 'eslint'
import rule from './prefer-early-return.js'

const ruleTester = new RuleTester()

ruleTester.run('prefer-early-return', rule, {
  valid: [
    // ─── Early return already used ─────────────────────────────────────
    {
      name: 'early return pattern already used',
      code: `
        function foo(x) {
          if (!x) return;
          doSomething();
          doMore();
        }
      `,
    },
    {
      name: 'early return with value',
      code: `
        function foo(x) {
          if (!x) return null;
          doSomething();
          doMore();
        }
      `,
    },
    {
      name: 'early throw pattern already used',
      code: `
        function foo(x) {
          if (!x) throw new Error('invalid');
          doSomething();
          doMore();
        }
      `,
    },

    // ─── If-else blocks (non-exit else) ────────────────────────────────
    {
      name: 'if-else block with non-exit else (not a candidate)',
      code: `
        function foo(x) {
          if (x) {
            doSomething();
          } else {
            doOther();
          }
        }
      `,
    },
    {
      name: 'if-else where both branches have multiple statements',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else {
            doC();
            doD();
          }
        }
      `,
    },
    {
      name: 'if-else where else has multiple statements including return',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else {
            doC();
            return;
          }
        }
      `,
    },
    {
      name: 'if-else where else is a non-exit single statement',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else {
            doC();
          }
        }
      `,
    },
    {
      name: 'if-else-if chain',
      code: `
        function foo(x) {
          if (x === 1) {
            doA();
            doB();
          } else if (x === 2) {
            doC();
          }
        }
      `,
    },
    {
      name: 'if-else-if-else chain',
      code: `
        function foo(x) {
          if (x === 1) {
            doA();
            doB();
          } else if (x === 2) {
            doC();
            doD();
          } else {
            doE();
          }
        }
      `,
    },
    {
      name: 'if-else where else has return but if has only 1 statement',
      code: `
        function foo(x) {
          if (x) {
            doA();
          } else {
            return;
          }
        }
      `,
    },

    // ─── Short if (single statement) ───────────────────────────────────
    {
      name: 'short if block with single statement',
      code: `
        function foo(x) {
          if (x) {
            doSomething();
          }
        }
      `,
    },
    {
      name: 'if with single return statement',
      code: `
        function foo(x) {
          if (x) {
            return 42;
          }
        }
      `,
    },
    {
      name: 'if without braces (single expression consequent)',
      code: `
        function foo(x) {
          if (x) doSomething();
        }
      `,
    },
    {
      name: 'if-else without braces',
      code: `
        function foo(x) {
          if (x) doA();
          else doB();
        }
      `,
    },
    {
      name: 'if with empty consequent block',
      code: `
        function foo(x) {
          if (x) {}
        }
      `,
    },

    // ─── If not last statement ─────────────────────────────────────────
    {
      name: 'if not the last statement in function',
      code: `
        function foo(x) {
          if (x) {
            doSomething();
            doMore();
          }
          doAfter();
        }
      `,
    },
    {
      name: 'multiple ifs, wrapping if is not the last one',
      code: `
        function foo(x, y) {
          if (x) {
            doA();
            doB();
          }
          if (y) {
            doC();
          }
        }
      `,
    },
    {
      name: 'if-else not the last statement',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else {
            return;
          }
          doAfter();
        }
      `,
    },

    // ─── Not inside a function ─────────────────────────────────────────
    {
      name: 'top-level if (not inside a function)',
      code: `
        if (true) {
          doSomething();
          doMore();
        }
      `,
    },
    {
      name: 'top-level nested if (not inside a function)',
      code: `
        if (true) {
          if (false) {
            doA();
            doB();
          }
        }
      `,
    },

    // ─── Inside non-function blocks ────────────────────────────────────
    {
      name: 'if inside a for loop',
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
    },
    {
      name: 'if inside a for-in loop',
      code: `
        function foo(obj) {
          for (const key in obj) {
            if (key) {
              doA();
              doB();
            }
          }
        }
      `,
    },
    {
      name: 'if inside a while loop',
      code: `
        function foo() {
          while (true) {
            if (x) {
              doA();
              doB();
            }
          }
        }
      `,
    },
    {
      name: 'if inside a do-while loop',
      code: `
        function foo() {
          do {
            if (x) {
              doA();
              doB();
            }
          } while (true);
        }
      `,
    },
    {
      name: 'if inside try block',
      code: `
        function foo() {
          try {
            if (x) {
              doA();
              doB();
            }
          } catch(e) {}
        }
      `,
    },
    {
      name: 'if inside catch block',
      code: `
        function foo() {
          try {} catch(e) {
            if (e) {
              doA();
              doB();
            }
          }
        }
      `,
    },
    {
      name: 'if inside finally block',
      code: `
        function foo() {
          try {} finally {
            if (x) {
              doA();
              doB();
            }
          }
        }
      `,
    },
    {
      name: 'if inside switch case',
      code: `
        function foo(x) {
          switch(x) {
            case 1:
              if (true) {
                doA();
                doB();
              }
              break;
          }
        }
      `,
    },
    {
      name: 'if inside another if with sibling (not last in function)',
      code: `
        function foo(x, y) {
          if (x) {
            if (y) {
              doA();
              doB();
            }
            doC();
          }
          doAfter();
        }
      `,
    },

    // ─── Nested function contexts ──────────────────────────────────────
    {
      name: 'nested function where inner function uses early return',
      code: `
        function foo(x) {
          function bar(y) {
            if (!y) return;
            doA();
            doB();
          }
          bar(x);
        }
      `,
    },
    {
      name: 'callback with early return',
      code: `
        function foo(items) {
          items.forEach(function(item) {
            if (!item) return;
            doA();
            doB();
          });
        }
      `,
    },
    {
      name: 'arrow callback with early return',
      code: `
        function foo(items) {
          items.forEach((item) => {
            if (!item) return;
            doA();
            doB();
          });
        }
      `,
    },

    // ─── Special function types with early return ──────────────────────
    {
      name: 'class method with early return already used',
      code: `
        class Foo {
          bar(x) {
            if (!x) return;
            doA();
            doB();
          }
        }
      `,
    },
    {
      name: 'async function with early return already used',
      code: `
        async function foo(x) {
          if (!x) return;
          await doA();
          doB();
        }
      `,
    },
    {
      name: 'generator function with early return already used',
      code: `
        function* foo(x) {
          if (!x) return;
          yield doA();
          doB();
        }
      `,
    },
    {
      name: 'IIFE with early return',
      code: `
        (function() {
          if (!x) return;
          doA();
          doB();
        })();
      `,
    },

    // ─── If with simple exit in if, else has single statement ──────────
    {
      name: 'if returns, else has only 1 statement (not worth flagging)',
      code: `
        function foo(x) {
          if (!x) {
            return null;
          } else {
            doA();
          }
        }
      `,
    },
    {
      name: 'if throws, else has only 1 statement (not worth flagging)',
      code: `
        function foo(x) {
          if (!x) {
            throw new Error('bad');
          } else {
            doA();
          }
        }
      `,
    },
    {
      name: 'if returns (no braces), else has only 1 statement',
      code: `
        function foo(x) {
          if (!x) return null;
          else {
            doA();
          }
        }
      `,
    },
    {
      name: 'if returns, else has only 1 statement (no braces)',
      code: `
        function foo(x) {
          if (!x) {
            return null;
          } else doA();
        }
      `,
    },

    // ─── Arrow function edge cases ─────────────────────────────────────
    {
      name: 'arrow function with implicit return (no block body)',
      code: `
        const foo = (x) => x ? doSomething() : null;
      `,
    },
    {
      name: 'arrow function with concise body',
      code: `
        const foo = (x) => doSomething(x);
      `,
    },
  ],
  invalid: [
    // ─── Basic wrapping if (original pattern) ──────────────────────────
    {
      name: 'wrapping if as last statement in function with multiple lines',
      code: `
        function foo(x) {
          if (x) {
            doSomething();
            doMore();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in arrow function',
      code: `
        const foo = (x) => {
          if (x) {
            doSomething();
            doMore();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in function expression',
      code: `
        const foo = function(x) {
          if (x) {
            doSomething();
            doMore();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Class methods ─────────────────────────────────────────────────
    {
      name: 'wrapping if in class method',
      code: `
        class Foo {
          bar(x) {
            if (x) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in static class method',
      code: `
        class Foo {
          static bar(x) {
            if (x) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in class getter',
      code: `
        class Foo {
          get bar() {
            if (this.x) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in class setter',
      code: `
        class Foo {
          set bar(value) {
            if (value) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in constructor',
      code: `
        class Foo {
          constructor(x) {
            if (x) {
              this.a = doA();
              this.b = doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in class private method',
      code: `
        class Foo {
          #bar(x) {
            if (x) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Async / generator functions ───────────────────────────────────
    {
      name: 'wrapping if in async function',
      code: `
        async function foo(x) {
          if (x) {
            await doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in async arrow function',
      code: `
        const foo = async (x) => {
          if (x) {
            await doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in generator function',
      code: `
        function* foo(x) {
          if (x) {
            yield doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Object / IIFE contexts ────────────────────────────────────────
    {
      name: 'wrapping if in object method shorthand',
      code: `
        const obj = {
          foo(x) {
            if (x) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'named function expression with wrapping if',
      code: `
        const foo = function bar(x) {
          if (x) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'IIFE with wrapping if',
      code: `
        (function(x) {
          if (x) {
            doA();
            doB();
          }
        })(true)
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'arrow IIFE with wrapping if',
      code: `
        ((x) => {
          if (x) {
            doA();
            doB();
          }
        })(true)
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Statements before the wrapping if ─────────────────────────────
    {
      name: 'function with statements before the wrapping if',
      code: `
        function foo(x) {
          const y = getY();
          if (x) {
            doA(y);
            doB(y);
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'function with multiple statements before wrapping if',
      code: `
        function foo(x) {
          const a = getA();
          const b = getB();
          log('processing');
          if (x) {
            doA(a);
            doB(b);
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Various condition types ───────────────────────────────────────
    {
      name: 'wrapping if with complex AND condition',
      code: `
        function foo(x, y) {
          if (x && y) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with complex OR condition',
      code: `
        function foo(x, y) {
          if (x || y) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with negated condition',
      code: `
        function foo(x) {
          if (!x) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with typeof check',
      code: `
        function foo(x) {
          if (typeof x === 'string') {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with instanceof check',
      code: `
        function foo(x) {
          if (x instanceof Error) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with comparison',
      code: `
        function foo(x) {
          if (x > 0) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with equality check',
      code: `
        function foo(x) {
          if (x === null) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with optional chaining in condition',
      code: `
        function foo(obj) {
          if (obj?.prop) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with destructured parameter',
      code: `
        function foo({ enabled }) {
          if (enabled) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with in operator',
      code: `
        function foo(obj) {
          if ('key' in obj) {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Large if bodies ───────────────────────────────────────────────
    {
      name: 'wrapping if with many statements (5+)',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
            doC();
            doD();
            doE();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Complex if body contents ──────────────────────────────────────
    {
      name: 'wrapping if containing a loop',
      code: `
        function foo(x) {
          if (x) {
            for (let i = 0; i < 10; i++) {
              doA();
            }
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with nested try-catch inside',
      code: `
        function foo(x) {
          if (x) {
            try {
              doA();
            } catch(e) {
              handleError(e);
            }
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if with variable declarations inside',
      code: `
        function foo(x) {
          if (x) {
            const a = getA();
            const b = getB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Callback patterns ─────────────────────────────────────────────
    {
      name: 'wrapping if in forEach callback',
      code: `
        function foo(items) {
          items.forEach(function(item) {
            if (item) {
              doA();
              doB();
            }
          });
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'wrapping if in arrow callback',
      code: `
        function foo(items) {
          items.map((item) => {
            if (item) {
              doA();
              doB();
            }
          });
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── Nested wrapping if (new pattern) ──────────────────────────────
    {
      name: 'nested wrapping if with multiple inner statements',
      code: `
        function foo(x, y) {
          if (x) {
            if (y) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'nested wrapping if with single inner statement',
      code: `
        function foo(x, y) {
          if (x) {
            if (y) {
              doA();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'nested wrapping if where inner has else',
      code: `
        function foo(x, y) {
          if (x) {
            if (y) {
              doA();
            } else {
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'nested wrapping if in arrow function',
      code: `
        const foo = (x, y) => {
          if (x) {
            if (y) {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'nested wrapping if in class method',
      code: `
        class Foo {
          bar(x, y) {
            if (x) {
              if (y) {
                doA();
                doB();
              }
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── If-else with simple exit in else (new pattern) ────────────────
    {
      name: 'if-else where else is a bare return',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else {
            return;
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if-else where else is a return with value',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else {
            return null;
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if-else where else is a bare return (no braces)',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else return;
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if-else where else is a throw',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else {
            throw new Error('fail');
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if-else where else is a throw (no braces)',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
          } else throw new Error('fail');
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if-else with simple return in else and many statements in if',
      code: `
        function foo(x) {
          if (x) {
            doA();
            doB();
            doC();
            doD();
          } else {
            return -1;
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'async function with if-else where else returns',
      code: `
        async function foo(x) {
          if (x) {
            await doA();
            doB();
          } else {
            return;
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'class method with if-else where else throws',
      code: `
        class Foo {
          bar(x) {
            if (x) {
              doA();
              doB();
            } else {
              throw new Error();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'arrow function with if-else where else returns value',
      code: `
        const foo = (x) => {
          if (x) {
            doA();
            doB();
          } else {
            return false;
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },

    // ─── If with simple exit in if, unnecessary else (new pattern) ────
    {
      name: 'if returns null, else has multiple statements',
      code: `
        function foo(x) {
          if (!x) {
            return null;
          } else {
            doA();
            doB();
            return result;
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if returns (bare), else has multiple statements',
      code: `
        function foo(x) {
          if (!x) {
            return;
          } else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if throws, else has multiple statements',
      code: `
        function foo(x) {
          if (!x) {
            throw new Error('invalid');
          } else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if returns (no braces), else has multiple statements',
      code: `
        function foo(x) {
          if (!x) return null;
          else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if throws (no braces), else has multiple statements',
      code: `
        function foo(x) {
          if (!x) throw new Error('bad');
          else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'async function with return in if, else has multiple statements',
      code: `
        async function foo(x) {
          if (!x) {
            return;
          } else {
            await doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'class method with return in if, else has multiple statements',
      code: `
        class Foo {
          bar(x) {
            if (!x) {
              return;
            } else {
              doA();
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'arrow function with return in if, else has multiple statements',
      code: `
        const foo = (x) => {
          if (!x) {
            return null;
          } else {
            doA();
            doB();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'if returns with value, else has many statements',
      code: `
        function foo(x) {
          if (!x) {
            return -1;
          } else {
            doA();
            doB();
            doC();
            doD();
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
    {
      name: 'statements before if with return in if branch',
      code: `
        function foo(x) {
          const y = getY();
          if (!x) {
            return null;
          } else {
            doA(y);
            doB(y);
          }
        }
      `,
      errors: [{ messageId: 'preferEarlyReturn' }],
    },
  ],
})
