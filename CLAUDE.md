# CLAUDE.md - AI Assistant Guide

This document provides guidance for AI assistants working with the Zimbabwe Arrival Card codebase.

## Project Overview

**Name:** zimbabwe-arrival-card
**Purpose:** A web application for managing Zimbabwe arrival card submissions for entry into Zimbabwe
**Owner:** Nyuchi Web Services (Bryan Fawcett, bryan@nyuchi.com)
**License:** MIT License (Copyright 2026)

## Technology Stack

- **Framework:** Next.js (React-based)
- **Language:** TypeScript
- **Deployment:** Vercel
- **Testing:** Jest (planned)
- **Package Manager:** npm or Yarn

## Project Status

This project is in its **initial setup phase**. Currently, only boilerplate files exist:
- `.gitignore` - Next.js standard ignores
- `LICENSE` - MIT License
- `README.md` - Basic project description

## Expected Directory Structure

When fully implemented, the project should follow Next.js conventions:

```
zimbabwe-arrival-card/
├── .env.local              # Local environment variables (gitignored)
├── .gitignore
├── CLAUDE.md               # This file
├── LICENSE
├── README.md
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── public/                 # Static assets
│   └── ...
├── src/                    # Source code (if using src directory)
│   ├── app/                # App Router pages (Next.js 13+)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   ├── components/         # Reusable React components
│   └── lib/                # Utility functions and helpers
└── tests/                  # Test files
    └── ...
```

## Development Workflow

### Setting Up the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Environment Variables

Environment files follow the pattern:
- `.env` - Default environment variables
- `.env.local` - Local overrides (gitignored)
- `.env.development` - Development-specific
- `.env.production` - Production-specific

**Never commit secrets or API keys.** Use `.env.local` for sensitive values.

## Code Conventions

### TypeScript

- Use TypeScript for all new files
- Define explicit types; avoid `any`
- Use interfaces for object shapes
- Export types alongside their implementations

### React/Next.js

- Use functional components with hooks
- Prefer Server Components where possible (Next.js 13+)
- Use the App Router pattern
- Keep components small and focused

### File Naming

- Components: `PascalCase.tsx` (e.g., `ArrivalCardForm.tsx`)
- Utilities: `camelCase.ts` (e.g., `validatePassport.ts`)
- Pages: Follow Next.js App Router conventions
- Test files: `*.test.ts` or `*.test.tsx`

### Code Style

- Use consistent formatting (Prettier recommended)
- Follow ESLint rules when configured
- Write self-documenting code
- Add comments only where logic isn't self-evident

## Key Domain Concepts

### Zimbabwe Arrival Card

The application handles arrival cards for travelers entering Zimbabwe. Key data fields likely include:
- Personal information (name, passport, nationality)
- Travel details (flight info, arrival date)
- Accommodation details
- Purpose of visit
- Health declarations (if applicable)

## Git Workflow

### Branch Naming

- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- AI assistant branches: `claude/<description>-<session-id>`

### Commit Messages

- Use clear, descriptive messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep the first line under 72 characters

### Pull Requests

- Provide a clear summary of changes
- Include testing instructions
- Reference related issues if applicable

## Testing Guidelines

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should handle expected behavior', () => {
    // Test implementation
  });
});
```

### What to Test

- Form validation logic
- API response handling
- Component rendering states
- Edge cases and error handling

## Common Tasks for AI Assistants

### Adding a New Component

1. Create component file in `src/components/`
2. Add TypeScript types for props
3. Export from component index if using barrel exports
4. Add tests for the component

### Adding a New API Route

1. Create route in `src/app/api/`
2. Handle appropriate HTTP methods
3. Validate input data
4. Return proper error responses
5. Add API documentation

### Fixing Bugs

1. Understand the issue fully before making changes
2. Write a failing test that reproduces the bug
3. Fix the bug
4. Verify the test passes
5. Check for regressions

## Security Considerations

- Validate all user input on both client and server
- Sanitize data before displaying
- Use HTTPS in production
- Store sensitive data securely
- Follow OWASP guidelines for web application security

## Deployment

The project is configured for Vercel deployment:
- Push to main branch triggers production deployment
- Pull requests create preview deployments
- Environment variables must be configured in Vercel dashboard

## Helpful Commands

```bash
# Check TypeScript types
npx tsc --noEmit

# Format code (if Prettier is configured)
npm run format

# Check for lint errors
npm run lint

# Run specific test file
npm test -- path/to/test.ts
```

## Questions and Support

For questions about this codebase, contact:
- **Owner:** Bryan Fawcett
- **Email:** bryan@nyuchi.com

---

*Last updated: January 2026*
