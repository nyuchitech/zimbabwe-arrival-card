# Zimbabwe e-Arrival Card System

![CI](https://github.com/nyuchitech/zimbabwe-arrival-card/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)

A modern web application for managing Zimbabwe arrival card submissions, enabling travelers to complete immigration forms digitally before arriving at any port of entry in Zimbabwe.

## Features

### For Travelers
- **Digital Arrival Cards**: Complete immigration forms online before travel
- **Multi-step Form**: Guided form with arrow progression, validation for personal, passport, travel, and customs information
- **QR Code System**: Generate and scan QR codes for fast processing at border posts
- **Email Notifications**: Automatic confirmations and status updates via Resend
- **Help Center**: Comprehensive FAQ and support resources at `/help`

### For Government Staff
- **Role-Based Dashboards**: Separate interfaces for Immigration, ZIMRA, Government, and Admin users
- **Officer Performance Tracking**: Monitor individual officer processing metrics, approval rates, and workload
- **Analytics Dashboard**: Real-time statistics, trends, and exportable reports
- **Staff Help Portal**: Role-specific guides and documentation at `/staff/help`

### Technical Features
- **Accessibility**: WCAG 2.2 AAA compliant with skip links and screen reader support
- **Mobile Responsive**: Works on all devices with optimized mobile experience
- **Skeleton Loading**: Beautiful loading states for all dashboard pages
- **Production Security**: Rate limiting, circuit breakers, and comprehensive audit logging

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (or [Supabase](https://supabase.com) account)
- [Resend](https://resend.com) API key (optional, for email)

### Installation

```bash
# Clone the repository
git clone https://github.com/nyuchitech/zimbabwe-arrival-card.git
cd zimbabwe-arrival-card

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
AUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional)
RESEND_API_KEY="re_..."
EMAIL_FROM="Zimbabwe Arrival Card <noreply@example.com>"
```

## Test Accounts

After running `npm run db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@zimbabwe.gov.zw | Admin@123 |
| Immigration | officer@immigration.gov.zw | Immigration@123 |
| ZIMRA | zimra@revenue.gov.zw | Zimra@123 |
| Government | official@government.gov.zw | Government@123 |
| Traveler | traveler@example.com | Traveler@123 |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with test data |
| `npm run db:studio` | Open Prisma Studio |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Authentication**: [NextAuth v5](https://authjs.dev)
- **Database**: PostgreSQL with [Prisma 7](https://www.prisma.io)
- **Validation**: [Zod v4](https://zod.dev)
- **Forms**: [React Hook Form](https://react-hook-form.com)
- **Email**: [Resend](https://resend.com)
- **Testing**: [Vitest](https://vitest.dev)

## Project Structure

```
├── .github/              # GitHub Actions & templates
├── docs/                 # Mintlify documentation
│   ├── mint.json         # Documentation config
│   ├── introduction/     # Getting started
│   ├── guides/           # Traveler guides
│   ├── staff/            # Staff documentation
│   └── api-reference/    # API docs
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── help/         # Public help & FAQ
│   │   ├── staff/help/   # Staff help portal
│   │   └── government/analytics/ # Analytics & officer performance
│   ├── components/       # React components
│   ├── lib/              # Utilities & configuration
│   ├── hooks/            # Custom React hooks
│   └── test/             # Test utilities
└── supabase/             # Supabase configuration
```

## Documentation

### User Documentation
- **Traveler Help**: `/help` - FAQ and support for travelers
- **Staff Portal**: `/staff/help` - Role-specific guides for government staff
- **[Mintlify Docs](./docs)** - Full documentation site (deploy to docs.yoursite.com)

### Developer Documentation
- [CLAUDE.md](./CLAUDE.md) - AI assistant guide and codebase documentation
- [CHANGELOG.md](./CHANGELOG.md) - Version history and changes
- [SECURITY.md](./SECURITY.md) - Security policy and vulnerability reporting
- [RELEASES.md](./RELEASES.md) - Release process documentation

## User Roles

| Role | Description |
|------|-------------|
| **Traveler** | Create and view own arrival cards |
| **Immigration** | Review, approve, and reject arrival cards |
| **ZIMRA** | Review customs declarations |
| **Government** | View statistics and reports |
| **Admin** | Full system access and user management |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new traveler |
| `/api/arrival-card` | GET | List arrival cards |
| `/api/arrival-card` | POST | Create arrival card |
| `/api/arrival-card/lookup` | GET | Public card lookup |
| `/api/arrival-card/verify` | GET | Officer verification |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](.github/PULL_REQUEST_TEMPLATE.md) before submitting.

## Security

For security vulnerabilities, please see our [Security Policy](./SECURITY.md).

**Do not** create public issues for security vulnerabilities. Email security@nyuchi.com instead.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- **Documentation**: [CLAUDE.md](./CLAUDE.md)
- **Issues**: [GitHub Issues](https://github.com/nyuchitech/zimbabwe-arrival-card/issues)
- **Email**: bryan@nyuchi.com

## Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Vercel](https://vercel.com) - Deployment platform
- [Supabase](https://supabase.com) - Database hosting
- [shadcn/ui](https://ui.shadcn.com) - UI components

---

**Developed by [Nyuchi Web Services](https://nyuchi.com)** | **Copyright 2026**
