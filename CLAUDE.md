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
| **Prisma 7** | ORM with PostgreSQL adapter |
| **PostgreSQL** | Production database (via Supabase) |
| **Zod v4** | Schema validation |
| **React Hook Form** | Form management |
| **Resend** | Email notifications |
| **Vitest** | Unit testing framework |
| **html5-qrcode** | QR code scanning |
| **qrcode.react** | QR code generation |

## Project Structure

```
zimbabwe-arrival-card/
├── .env                        # Environment variables
├── .env.example                # Environment template
├── .gitignore
├── .github/
│   ├── ISSUE_TEMPLATE/         # Bug & feature templates
│   ├── workflows/              # CI/CD pipelines
│   ├── dependabot.yml          # Dependency updates
│   └── PULL_REQUEST_TEMPLATE.md
├── CHANGELOG.md                # Version history
├── CLAUDE.md                   # This file
├── CONTRIBUTING.md             # Contribution guide
├── LICENSE
├── README.md
├── RELEASES.md                 # Release process
├── SECURITY.md                 # Security policy
├── next.config.ts              # Next.js configuration
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seed script
│   └── migrations/             # Database migrations
├── supabase/
│   ├── config.toml             # Supabase local config
│   ├── migrations/             # PostgreSQL migrations
│   └── seed.sql                # Database seed SQL
├── docs/                       # Mintlify documentation
│   ├── mint.json               # Mintlify configuration
│   ├── introduction/           # Getting started guides
│   ├── guides/                 # Traveler guides & FAQs
│   ├── staff/                  # Staff documentation
│   └── api-reference/          # API documentation
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── error.tsx           # Error boundary page
│   │   ├── global-error.tsx    # Global error handler
│   │   ├── not-found.tsx       # 404 page
│   │   ├── loading.tsx         # Loading state
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── error/
│   │   ├── dashboard/          # Traveler dashboard
│   │   ├── arrival-card/       # Arrival card management
│   │   │   ├── new/            # New arrival card form
│   │   │   ├── lookup/         # Public card lookup
│   │   │   └── [id]/success/   # Submission success
│   │   ├── immigration/        # Immigration officer dashboard
│   │   │   └── scan/           # QR code scanner
│   │   ├── government/         # Government dashboard
│   │   │   └── analytics/      # Analytics dashboard
│   │   │       └── officers/   # Officer performance tracking
│   │   ├── zimra/              # ZIMRA customs dashboard
│   │   ├── admin/              # Admin dashboard
│   │   ├── help/               # Public help & FAQ page
│   │   ├── staff/              # Staff portal
│   │   │   └── help/           # Internal staff help
│   │   ├── accessibility/      # Accessibility statement
│   │   ├── privacy-policy/     # Privacy policy
│   │   ├── terms-of-service/   # Terms of service
│   │   └── api/                # API routes
│   │       ├── auth/
│   │       │   ├── [...nextauth]/
│   │       │   └── register/
│   │       └── arrival-card/
│   │           ├── route.ts    # List/create cards
│   │           ├── lookup/     # Public lookup
│   │           └── verify/     # Officer verification
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── form-stepper.tsx    # Multi-step form navigation
│   │   │   ├── dashboard-skeletons.tsx # Loading skeletons
│   │   │   └── accordion.tsx   # Collapsible accordion
│   │   ├── dashboard/          # Dashboard components
│   │   ├── providers/          # Context providers
│   │   ├── qr-scanner.tsx      # QR code scanner
│   │   ├── qr-code-display.tsx # QR code display
│   │   ├── epass-actions.tsx   # e-Pass action buttons
│   │   ├── error-boundary.tsx  # Error boundary wrapper
│   │   └── skip-link.tsx       # Accessibility skip link
│   ├── lib/
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── auth.config.ts      # Edge-compatible auth config
│   │   ├── db.ts               # Prisma client with lazy init
│   │   ├── rbac.ts             # Role-based access control
│   │   ├── rate-limit.ts       # API rate limiting
│   │   ├── email.ts            # Email notifications (Resend)
│   │   ├── utils.ts            # Utility functions
│   │   └── validations/        # Zod schemas
│   │       ├── auth.ts
│   │       └── arrival-card.ts
│   ├── hooks/                  # Custom React hooks
│   │   └── use-mobile.ts       # Mobile detection hook
│   ├── test/                   # Test utilities
│   │   ├── setup.ts            # Vitest setup
│   │   └── mocks.ts            # Test mocks
│   ├── generated/
│   │   └── prisma/             # Generated Prisma client
│   └── middleware.ts           # NextAuth middleware
└── public/                     # Static assets
```

## User Roles (RBAC)

The system implements Role-Based Access Control with five roles:

| Role | Description | Permissions |
|------|-------------|-------------|
| **TRAVELER** | Regular users filling arrival cards | Create/view own arrival cards |
| **IMMIGRATION** | Border post officers | Review, approve, reject arrival cards |
| **ZIMRA** | Zimbabwe Revenue Authority | View customs declarations, review goods |
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
| `npm run build` | Build for production (includes Prisma generate) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
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
| ZIMRA | zimra@revenue.gov.zw | Zimra@123 |
| Government | official@government.gov.zw | Government@123 |
| Traveler | traveler@example.com | Traveler@123 |

## Environment Variables

Required variables in `.env`:

```env
# Database (PostgreSQL via Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth
AUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional - Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="Zimbabwe Arrival Card <noreply@immigration.gov.zw>"
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
| `src/lib/db.ts` | Prisma client with lazy PostgreSQL initialization |
| `src/lib/rbac.ts` | Role permissions and helper functions |
| `src/lib/rate-limit.ts` | In-memory rate limiting for API routes |
| `src/lib/email.ts` | Email notifications via Resend |
| `src/middleware.ts` | Route protection based on authentication and roles |
| `prisma/schema.prisma` | Complete database schema |
| `supabase/config.toml` | Supabase local development configuration |
| `src/lib/validations/arrival-card.ts` | Form validation schemas |
| `src/components/qr-scanner.tsx` | QR code scanner for immigration officers |
| `src/components/qr-code-display.tsx` | QR code display component |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new traveler
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

### Arrival Cards
- `GET /api/arrival-card` - List arrival cards (filtered by role)
- `POST /api/arrival-card` - Create new arrival card
- `GET /api/arrival-card/lookup` - Public lookup (reference + passport required)
- `GET /api/arrival-card/verify` - Officer verification (requires IMMIGRATION/ADMIN role)

### Rate Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/arrival-card/lookup` | 10 requests | 60 seconds |
| `/api/arrival-card/verify` | 60 requests | 60 seconds |

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

## QR Code Workflow

The application uses QR codes to speed up arrival card verification at border posts:

### Traveler Flow
1. Submit arrival card at `/arrival-card/new`
2. Receive QR code on success page and via email
3. Present QR code at immigration checkpoint

### Officer Flow
1. Navigate to `/immigration/scan`
2. Scan traveler's QR code using device camera
3. View full arrival card details for verification
4. Approve or reject the card

### QR Code Content
The QR code encodes a URL: `{NEXTAUTH_URL}/api/arrival-card/verify?ref={referenceNumber}`

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure Supabase PostgreSQL database
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
AUTH_SECRET="generate-secure-secret"
NEXTAUTH_URL="https://your-domain.com"
RESEND_API_KEY="re_..."
EMAIL_FROM="Zimbabwe Arrival Card <noreply@your-domain.com>"
```

## Technical Notes

### Prisma 7 with PostgreSQL Adapter

This project uses Prisma 7 which requires a driver adapter. The `src/lib/db.ts` file uses lazy initialization with a proxy pattern to avoid build-time database connections:

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient(): PrismaClient {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Proxy for lazy initialization
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getDb(); // Lazy load
    return client[prop];
  },
});
```

### Supabase Integration

The project uses Supabase for PostgreSQL hosting. Configuration is in `supabase/`:
- `config.toml` - Local development settings
- `migrations/` - PostgreSQL migrations
- `seed.sql` - Database seeding

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

### Rate Limiting

The `src/lib/rate-limit.ts` module provides in-memory rate limiting:

```typescript
import { rateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

// In API route
const clientIp = getClientIp(request);
const result = rateLimit(`endpoint:${clientIp}`, {
  limit: 10,
  windowInSeconds: 60,
});

if (!result.success) {
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: rateLimitHeaders(result) }
  );
}
```

**Note:** For production at scale, consider using Upstash Redis or Vercel KV.

### Email Notifications

Email is handled via Resend in `src/lib/email.ts`:

```typescript
import { sendArrivalCardConfirmation, sendStatusUpdateEmail } from "@/lib/email";

// Send confirmation after submission
await sendArrivalCardConfirmation({
  to: "traveler@example.com",
  firstName: "John",
  lastName: "Doe",
  referenceNumber: "ZIM-ABC123",
  arrivalDate: new Date(),
});

// Send status update
await sendStatusUpdateEmail({
  to: "traveler@example.com",
  firstName: "John",
  lastName: "Doe",
  referenceNumber: "ZIM-ABC123",
  status: "APPROVED",
});
```

If `RESEND_API_KEY` is not set, emails are skipped with a warning.

### Testing with Vitest

Tests are located alongside source files (`*.test.ts`) and in `src/test/`:

```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:coverage
```

Test setup in `src/test/setup.ts` mocks:
- `next/navigation` (useRouter, useSearchParams, usePathname)
- `next-auth/react` (useSession, signIn, signOut)

### Public Routes

Routes accessible without authentication (configured in `src/lib/auth.config.ts`):
- `/` - Landing page
- `/auth/*` - Login, register, error pages
- `/arrival-card/new` - Create new arrival card
- `/arrival-card/lookup` - Look up existing card
- `/privacy-policy` - Privacy policy
- `/terms-of-service` - Terms of service
- `/accessibility` - Accessibility statement

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Prisma client not found | Run `npm run db:generate` |
| Database not synced | Run `npm run db:push` or `npm run db:migrate` |
| Database connection error | Check `DATABASE_URL` is set correctly for PostgreSQL |
| Auth not working | Check `AUTH_SECRET` is set |
| Role access denied | Verify role in middleware.ts and rbac.ts |
| Edge runtime error | Don't import Prisma client in middleware |
| useSearchParams error | Wrap in Suspense boundary |
| Email not sending | Check `RESEND_API_KEY` is set (optional feature) |
| Rate limit exceeded | Wait for window to reset or increase limits |
| Tests failing | Run `npm run db:generate` first |

### QR Code Issues

| Issue | Solution |
|-------|----------|
| Scanner not working | Ensure HTTPS (camera requires secure context) |
| Camera permission denied | Check browser permissions |
| QR not scanning | Ensure adequate lighting, code is in focus |

## Questions and Support

For questions about this codebase, contact:
- **Owner:** Bryan Fawcett
- **Email:** bryan@nyuchi.com

---

*Last updated: January 2026*
