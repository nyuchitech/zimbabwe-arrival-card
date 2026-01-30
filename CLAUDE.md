# CLAUDE.md - AI Assistant Guide

This document provides guidance for AI assistants working with the Zimbabwe Arrival Card codebase.

## Project Overview

**Name:** zimbabwe-arrival-card
**Purpose:** A web application for managing Zimbabwe arrival card submissions for all entries into Zimbabwe
**Owner:** Nyuchi Web Services (Bryan Fawcett, bryan@nyuchi.com)
**License:** MIT License (Copyright 2026)

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **shadcn/ui** | UI component library |
| **NextAuth v5** | Authentication (credentials-based) |
| **Prisma 7** | ORM with libsql adapter |
| **SQLite/libsql** | Development database (use PostgreSQL in production) |
| **Zod v4** | Schema validation |
| **React Hook Form** | Form management |

## Project Structure

```
zimbabwe-arrival-card/
├── .env                        # Environment variables
├── .gitignore
├── CLAUDE.md                   # This file
├── LICENSE
├── README.md
├── next.config.ts              # Next.js configuration
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seed script
│   └── migrations/             # Database migrations
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── error/
│   │   ├── dashboard/          # Traveler dashboard
│   │   ├── arrival-card/       # Arrival card form
│   │   │   └── new/
│   │   ├── immigration/        # Immigration officer dashboard
│   │   ├── government/         # Government dashboard
│   │   ├── admin/              # Admin dashboard
│   │   └── api/                # API routes
│   │       ├── auth/
│   │       │   ├── [...nextauth]/
│   │       │   └── register/
│   │       └── arrival-card/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── dashboard/          # Dashboard components
│   │   └── providers/          # Context providers
│   ├── lib/
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── rbac.ts             # Role-based access control
│   │   ├── utils.ts            # Utility functions
│   │   └── validations/        # Zod schemas
│   │       ├── auth.ts
│   │       └── arrival-card.ts
│   ├── hooks/                  # Custom React hooks
│   ├── generated/
│   │   └── prisma/             # Generated Prisma client
│   └── middleware.ts           # NextAuth middleware
└── public/                     # Static assets
```

## User Roles (RBAC)

The system implements Role-Based Access Control with four roles:

| Role | Description | Permissions |
|------|-------------|-------------|
| **TRAVELER** | Regular users filling arrival cards | Create/view own arrival cards |
| **IMMIGRATION** | Border post officers | Review, approve, reject arrival cards |
| **GOVERNMENT** | Government officials | View statistics and reports |
| **ADMIN** | System administrators | Full system access, user management |

## Database Schema

### Key Models

- **User** - Authentication and role management
- **ArrivalCard** - Main arrival card submissions
- **Companion** - Group travelers linked to arrival cards
- **BorderPost** - Zimbabwe entry points
- **AuditLog** - System activity tracking
- **SystemSetting** - Configuration settings

### Arrival Card Status Flow

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED
                               ↘ REJECTED
                               ↘ EXPIRED
```

## Development Workflow

### Initial Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with test data
npm run db:seed

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema changes |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Generate Prisma client |

### Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@zimbabwe.gov.zw | Admin@123 |
| Immigration | officer@immigration.gov.zw | Immigration@123 |
| Government | official@government.gov.zw | Government@123 |
| Traveler | traveler@example.com | Traveler@123 |

## Environment Variables

Required variables in `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Zimbabwe Brand Colors

The application uses Zimbabwe national flag colors:

| Color | Hex | CSS Variable |
|-------|-----|--------------|
| Green | #319B4B | `--zim-green` |
| Yellow | #FFD100 | `--zim-yellow` |
| Red | #DE2010 | `--zim-red` |
| Black | #1A1A1A | `--zim-black` |

Usage in Tailwind: `text-zim-green`, `bg-zim-yellow`, etc.

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth configuration with credentials provider |
| `src/lib/auth.config.ts` | Edge-compatible auth config (no Prisma imports) |
| `src/lib/db.ts` | Prisma client singleton with libsql adapter |
| `src/lib/rbac.ts` | Role permissions and helper functions |
| `src/middleware.ts` | Route protection based on authentication and roles |
| `prisma/schema.prisma` | Complete database schema |
| `prisma/prisma.config.ts` | Prisma 7 configuration with database URL |
| `src/lib/validations/arrival-card.ts` | Form validation schemas |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new traveler
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

### Arrival Cards
- `GET /api/arrival-card` - List arrival cards (filtered by role)
- `POST /api/arrival-card` - Create new arrival card

## Common Tasks for AI Assistants

### Adding a New Page

1. Create folder in `src/app/` following Next.js App Router conventions
2. Add `page.tsx` for the main content
3. Add `layout.tsx` if custom layout needed
4. Update middleware if route protection required

### Adding a New API Endpoint

1. Create route file in `src/app/api/[endpoint]/route.ts`
2. Implement HTTP method handlers (GET, POST, etc.)
3. Add authentication check with `auth()`
4. Validate input with Zod schemas
5. Handle errors appropriately

### Modifying the Database Schema

1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate` with migration name
3. Run `npm run db:generate`
4. Update TypeScript types if needed

### Adding a New Role Permission

1. Update `ROLE_PERMISSIONS` in `src/lib/rbac.ts`
2. Add permission check in relevant components/routes
3. Update middleware if route-level protection needed

## Code Conventions

### TypeScript
- Use explicit types; avoid `any`
- Export types alongside implementations
- Use Zod for runtime validation

### React/Next.js
- Use Server Components by default
- Use `"use client"` only when needed (forms, hooks, events)
- Keep components focused and small

### File Naming
- Components: `kebab-case.tsx` (shadcn convention)
- Utilities: `camelCase.ts`
- Pages: Follow Next.js App Router conventions

### Imports
- Use `@/` alias for absolute imports
- Group imports: external, internal, components, types

## Security Considerations

- Validate all user input with Zod
- Use prepared statements via Prisma
- Implement RBAC at route and API level
- Hash passwords with bcrypt (12 rounds)
- Use secure session management via NextAuth
- Never expose sensitive data in client components

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure production database (PostgreSQL recommended)
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="generate-secure-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## Technical Notes

### Prisma 7 with libsql Adapter

This project uses Prisma 7 which requires a driver adapter. The `src/lib/db.ts` file initializes the Prisma client with the `@prisma/adapter-libsql` adapter:

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
export const db = new PrismaClient({ adapter });
```

### Edge Runtime Compatibility

The middleware runs in Edge Runtime which cannot import Node.js modules. Therefore:
- `src/lib/auth.config.ts` contains edge-compatible auth configuration
- `src/lib/auth.ts` contains the full auth configuration with Prisma
- Middleware only imports from `auth.config.ts`

### useSearchParams and Suspense

Pages using `useSearchParams()` must wrap the component in a `<Suspense>` boundary for static generation:

```tsx
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ComponentUsingSearchParams />
    </Suspense>
  );
}
```

### Zod v4 API Changes

Zod v4 uses `error` instead of `required_error` for enums:

```typescript
// Correct for Zod v4
z.enum(["A", "B"], { error: "Selection required" })

// Error property for validation failures
error.issues // instead of error.errors
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Prisma client not found | Run `npm run db:generate` |
| Database not synced | Run `npm run db:push` or `npm run db:migrate` |
| Auth not working | Check AUTH_SECRET is set |
| Role access denied | Verify role in middleware.ts |
| Edge runtime error | Don't import Prisma client in middleware |
| useSearchParams error | Wrap in Suspense boundary |

## Questions and Support

For questions about this codebase, contact:
- **Owner:** Bryan Fawcett
- **Email:** bryan@nyuchi.com

---

*Last updated: January 2026*
