import preferEarlyReturn from './rules/prefer-early-return.js'

interface EarlyReturnPlugin {
  meta: {
    name: string
    version: string
  }
  rules: Record<string, typeof preferEarlyReturn>
  configs: Record<string, unknown>
}

const plugin: EarlyReturnPlugin = {
  meta: {
    name: 'eslint-plugin-early-return',
    version: '0.0.0',
  },
  rules: {
    'prefer-early-return': preferEarlyReturn,
  },
  configs: {},
}

plugin.configs['recommended'] = {
  plugins: {
    'early-return': plugin,
  },
  rules: {
    'early-return/prefer-early-return': 'error',
  },
}

export default plugin
