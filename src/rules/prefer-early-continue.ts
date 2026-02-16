import type { Rule } from 'eslint'

const LOOP_TYPES = new Set([
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
])

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

        if (!isLastStatement) {
          return
        }

        if (node.alternate) {
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
