# Contributing to eslint-plugin-early-return

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `pnpm install`
3. **Create a branch** for your changes: `git checkout -b feature/your-feature-name`

## Development Workflow

### Prerequisites

- Node.js >= 20.0.0
- pnpm (latest version)

### Setup

```bash
pnpm install
pnpm build
pnpm test
```

### Development Commands

- `pnpm dev` - Build in watch mode
- `pnpm test` - Run tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Check code quality
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code
- `pnpm format:check` - Check formatting
- `pnpm spell` - Check spelling
- `pnpm knip` - Find unused files, dependencies, and exports

## Making Changes

### Code Style

This project uses:

- **TypeScript** with strict mode
- **ESLint** with `eslint-config-agent` for linting
- **Prettier** for code formatting
- **cspell** for spell checking

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

### Testing

- Write tests for all new rules and bug fixes
- Ensure all tests pass: `pnpm test`
- Maintain or improve code coverage (80% minimum threshold)
- Tests should be in `.spec.ts` files next to their corresponding logic files

### Git Hooks

- **Pre-commit**: Runs lint-staged (lints, formats, and spell-checks staged files)
- **Commit-msg**: Validates commit message format using commitlint
- **Pre-push**: Runs full validation (lint, format, spell, knip, tests)

## Submitting Changes

1. Run all checks locally: `pnpm lint && pnpm format:check && pnpm spell && pnpm knip && pnpm test && pnpm build`
2. Push your changes and open a Pull Request
3. Ensure CI passes

## License

By contributing, you agree that your contributions will be licensed under the MIT license.
