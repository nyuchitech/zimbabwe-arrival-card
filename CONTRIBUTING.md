# Contributing to Zimbabwe e-Arrival Card

Thank you for your interest in contributing to the Zimbabwe e-Arrival Card system!

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/nyuchitech/zimbabwe-arrival-card/issues)
2. If not, create a new issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml)
3. Include as much detail as possible

### Suggesting Features

1. Check existing [feature requests](https://github.com/nyuchitech/zimbabwe-arrival-card/issues?q=is%3Aissue+label%3Aenhancement)
2. Create a new issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml)
3. Describe the problem and proposed solution

### Submitting Code

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our coding standards
5. **Test** your changes:
   ```bash
   npm run test:run
   npm run lint
   npm run build
   ```
6. **Commit** with a descriptive message:
   ```bash
   git commit -m "feat: add new feature description"
   ```
7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** against the `main` branch

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/zimbabwe-arrival-card.git
cd zimbabwe-arrival-card

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npm run db:generate

# Start development
npm run dev
```

## Coding Standards

### TypeScript

- Use explicit types; avoid `any`
- Export types alongside implementations
- Use Zod for runtime validation

### React/Next.js

- Use Server Components by default
- Use `"use client"` only when needed
- Keep components focused and small

### File Naming

- Components: `kebab-case.tsx`
- Utilities: `camelCase.ts`
- Pages: Follow Next.js App Router conventions

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Pull Request Guidelines

- Fill out the PR template completely
- Link related issues
- Include tests for new features
- Update documentation as needed
- Ensure all CI checks pass

## Security

- Never commit secrets or credentials
- Validate all user inputs
- Use Prisma for database queries (no raw SQL)
- Follow the [Security Policy](./SECURITY.md)

## Questions?

- Open a [Discussion](https://github.com/nyuchitech/zimbabwe-arrival-card/discussions)
- Email: bryan@nyuchi.com

Thank you for contributing!
