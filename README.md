# eslint-plugin-early-return

ESLint plugin that suggests early return patterns to improve code readability.

## Installation

```bash
npm install --save-dev eslint-plugin-early-return
```

## Usage

Add the recommended configuration to your ESLint flat config:

```js
import earlyReturn from 'eslint-plugin-early-return'

export default [earlyReturn.configs.recommended]
```

## License

MIT

## Special Thanks

Special thanks to [@hyoban](https://github.com/hyoban) who previously held the `eslint-plugin-early-return` package name and generously agreed to transfer ownership, contributing to the open source ecosystem.
