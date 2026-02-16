import type { Rule } from 'eslint'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ASTNode = any

function isSimpleExit(node: ASTNode): boolean {
  if (node.type === 'ReturnStatement' || node.type === 'ThrowStatement') {
    return true
  }

  return (
    node.type === 'BlockStatement' &&
    node.body.length === 1 &&
    (node.body[0].type === 'ReturnStatement' ||
      node.body[0].type === 'ThrowStatement')
  )
}

function getBlockBody(node: ASTNode): ASTNode[] | undefined {
  return node.type === 'BlockStatement' ? node.body : undefined
}

function isLastIfInFunction(node: Rule.Node): boolean {
  const parent = node.parent

  if (!parent) return false

  const isInsideFunction =
    parent.type === 'BlockStatement' &&
    parent.parent &&
    (parent.parent.type === 'FunctionDeclaration' ||
      parent.parent.type === 'FunctionExpression' ||
      parent.parent.type === 'ArrowFunctionExpression')

  if (!isInsideFunction) return false

  const body = getBlockBody(parent)
  if (!body) return false

  const nodeIndex = body.indexOf(node)
  return nodeIndex === body.length - 1
}

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
        if (!isLastIfInFunction(node)) return

        const blockBody = getBlockBody(node.consequent)

        if (!node.alternate) {
          if (blockBody && blockBody.length >= 2) {
            context.report({ node, messageId: 'preferEarlyReturn' })
            return
          }

          if (
            blockBody &&
            blockBody.length === 1 &&
            blockBody[0].type === 'IfStatement'
          ) {
            context.report({ node, messageId: 'preferEarlyReturn' })
          }

          return
        }

        const alt = node.alternate

        if (isSimpleExit(alt) && blockBody && blockBody.length >= 2) {
          context.report({ node, messageId: 'preferEarlyReturn' })
          return
        }

        const altBody = getBlockBody(alt)

        if (isSimpleExit(node.consequent) && altBody && altBody.length >= 2) {
          context.report({ node, messageId: 'preferEarlyReturn' })
        }
      },
    }
  },
}

export default rule
