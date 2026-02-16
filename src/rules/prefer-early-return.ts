import type { Rule } from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Suggest using early return to reduce nesting and improve readability',
      recommended: true,
    },
    messages: {
      preferEarlyReturn:
        'Consider using an early return to reduce nesting. Invert the condition and return early instead of wrapping the remaining code in an if block.',
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

        const isInsideFunction =
          parent.type === 'BlockStatement' &&
          parent.parent &&
          (parent.parent.type === 'FunctionDeclaration' ||
            parent.parent.type === 'FunctionExpression' ||
            parent.parent.type === 'ArrowFunctionExpression')

        if (!isInsideFunction || !parent.parent) {
          return
        }

        if (node.alternate) {
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

        const consequent = node.consequent
        const blockBody =
          consequent.type === 'BlockStatement' ? consequent.body : undefined

        if (!blockBody || blockBody.length < 2) {
          return
        }

        context.report({
          node,
          messageId: 'preferEarlyReturn',
        })
      },
    }
  },
}

export default rule
