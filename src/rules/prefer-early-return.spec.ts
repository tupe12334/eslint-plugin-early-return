import { RuleTester } from 'eslint'
import rule from './prefer-early-return.js'

const ruleTester = new RuleTester()

ruleTester.run('prefer-early-return', rule, {
  valid: [
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
      name: 'if-else block (not a candidate for early return)',
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
      name: 'top-level if (not inside a function)',
      code: `
        if (true) {
          doSomething();
          doMore();
        }
      `,
    },
  ],
  invalid: [
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
  ],
})
