import { describe, it, expect } from 'vitest'
import plugin from './index.js'

describe('eslint-plugin-early-return', () => {
  it('should export the plugin with correct meta', () => {
    expect(plugin.meta.name).toBe('eslint-plugin-early-return')
  })

  it('should export the prefer-early-return rule', () => {
    expect(plugin.rules['prefer-early-return']).toBeDefined()
  })

  it('should export a recommended config', () => {
    expect(plugin.configs['recommended']).toBeDefined()
  })

  it('should have the rule enabled as error in recommended config', () => {
    const config: { rules: Record<string, string> } =
      plugin.configs['recommended']
    expect(config.rules['early-return/prefer-early-return']).toBe('error')
  })
})
