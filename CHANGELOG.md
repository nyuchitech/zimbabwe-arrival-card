# Changelog

All notable changes to the Zimbabwe e-Arrival Card system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive CLAUDE.md documentation for AI assistants
- robots.txt for search engine and security configuration
- SECURITY.md vulnerability disclosure policy
- GitHub Actions CI/CD pipeline with Claude code review

## [0.3.0] - 2026-01-30

### Added
- Supabase PostgreSQL integration for production database
- Email notifications via Resend API
- QR code scanning for immigration officers at `/immigration/scan`
- Public arrival card lookup at `/arrival-card/lookup`
- API rate limiting for security
- ZIMRA (Zimbabwe Revenue Authority) role and dashboard
- Comprehensive test suite with Vitest

### Changed
- Migrated from SQLite/libsql to PostgreSQL
- Updated Prisma 7 adapter from libsql to pg
- Lazy database initialization to prevent build-time connections

### Security
- Added rate limiting on lookup and verify endpoints
- Implemented IP-based request throttling

## [0.2.0] - 2026-01-29

### Added
- WCAG 2.2 AAA accessibility compliance
- Skip link for keyboard navigation
- Accessibility statement page
- Privacy policy page
- Terms of service page
- Error boundaries and global error handling
- Loading states for all dashboard pages
- Mobile-responsive improvements

### Changed
- Improved text visibility and contrast ratios
- Enhanced form accessibility with ARIA labels

### Fixed
- Client-side hydration errors
- Build-time database connection issues
- Public route configuration in auth middleware

## [0.1.0] - 2026-01-28

### Added
- Initial release of Zimbabwe e-Arrival Card system
- Multi-step arrival card form with validation
- Role-based access control (TRAVELER, IMMIGRATION, GOVERNMENT, ADMIN)
- NextAuth v5 authentication with credentials provider
- Traveler dashboard for managing arrival cards
- Immigration officer dashboard for reviewing cards
- Government dashboard for statistics and reports
- Admin dashboard for system management
- Border post management
- Companion traveler support
- Customs and health declarations
- Audit logging for all actions
- Zimbabwe brand colors and styling

### Security
- bcrypt password hashing (12 rounds)
- JWT session management
- Zod input validation
- Prisma prepared statements

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.3.0 | 2026-01-30 | PostgreSQL, email notifications, QR scanning |
| 0.2.0 | 2026-01-29 | Accessibility, error handling, legal pages |
| 0.1.0 | 2026-01-28 | Initial release |

[Unreleased]: https://github.com/nyuchitech/zimbabwe-arrival-card/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/nyuchitech/zimbabwe-arrival-card/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/nyuchitech/zimbabwe-arrival-card/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nyuchitech/zimbabwe-arrival-card/releases/tag/v0.1.0
