import type { Rule } from 'eslint'

const LOOP_TYPES = new Set([
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ASTNode = any

function isSimpleLoopExit(node: ASTNode): boolean {
  if (node.type === 'ContinueStatement' || node.type === 'BreakStatement') {
    return true
  }

  return (
    node.type === 'BlockStatement' &&
    node.body.length === 1 &&
    (node.body[0].type === 'ContinueStatement' ||
      node.body[0].type === 'BreakStatement')
  )
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Suggest using early continue in loops to reduce nesting and improve readability',
      recommended: true,
    },
    messages: {
      preferEarlyContinue:
        'Consider using an early continue to reduce nesting. Invert the condition and continue early instead of wrapping the remaining code in an if block.',
      unnecessaryElse:
        'Unnecessary else after continue/break in loop. Remove the else block and place its contents after the if statement.',
    },
    schema: [],
  },
  create(context) {
    return {
      IfStatement(node) {
        const parent = node.parent

        if (!parent) {
          return
        }

        const isInsideLoop =
          parent.type === 'BlockStatement' &&
          parent.parent &&
          LOOP_TYPES.has(parent.parent.type)

        if (!isInsideLoop || !parent.parent) {
          return
        }

        const body = parent.type === 'BlockStatement' ? parent.body : undefined

        if (!body) {
          return
        }

        const nodeIndex = body.indexOf(node)
        const isLastStatement = nodeIndex === body.length - 1

        if (node.alternate) {
          // If the if-branch is a simple loop exit (continue/break),
          // the else is always unnecessary
          if (isSimpleLoopExit(node.consequent)) {
            context.report({
              node,
              messageId: 'unnecessaryElse',
            })
            return
          }

          // If the else-branch is a simple loop exit (continue/break),
          // suggest inverting to use early continue/break
          if (isSimpleLoopExit(node.alternate)) {
            const blockBody =
              node.consequent.type === 'BlockStatement'
                ? node.consequent.body
                : undefined

            if (blockBody && blockBody.length >= 2) {
              context.report({
                node,
                messageId: 'unnecessaryElse',
              })
            }
          }

          return
        }

        if (!isLastStatement) {
          return
        }

        const consequent = node.consequent
        const blockBody =
          consequent.type === 'BlockStatement' ? consequent.body : undefined

        if (blockBody && blockBody.length >= 2) {
          context.report({
            node,
            messageId: 'preferEarlyContinue',
          })
        }
      },
    }
  },
}

export default rule
