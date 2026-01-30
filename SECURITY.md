# Security Policy

## Overview

The Zimbabwe e-Arrival Card system handles sensitive personal information including passport details, travel itineraries, and customs declarations. Security is a top priority.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.3.x   | :white_check_mark: |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns to: **security@nyuchi.com**
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Resolution Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

### Safe Harbor

We consider security research conducted in accordance with this policy to be:
- Authorized under applicable anti-hacking laws
- Exempt from DMCA restrictions
- Lawful and welcome

## Security Measures

### Authentication & Authorization

- **Password Hashing**: bcrypt with 12 salt rounds
- **Session Management**: JWT tokens via NextAuth v5
- **Role-Based Access Control**: 5 roles with granular permissions
- **Session Expiry**: Configurable token lifetime

### Data Protection

- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Prevention**: React's built-in escaping + Content Security Policy
- **CSRF Protection**: NextAuth CSRF tokens

### API Security

- **Rate Limiting**: IP-based throttling on sensitive endpoints
  - Lookup: 10 requests/minute
  - Verify: 60 requests/minute
- **Authentication Required**: Protected routes require valid session
- **Role Verification**: API endpoints check user roles

### Infrastructure Security

- **HTTPS Only**: All traffic encrypted in transit
- **Environment Variables**: Secrets stored securely, never in code
- **Database**: PostgreSQL with connection pooling
- **Hosting**: Vercel with automatic security updates

## Security Headers

The application implements the following security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Data Handling

### Personal Data Collected

- Full name, date of birth, gender
- Passport information
- Contact details (email, phone)
- Travel itinerary
- Accommodation details
- Customs declarations
- Health declarations

### Data Retention

- Active arrival cards: Until travel date + 90 days
- Audit logs: 7 years (regulatory requirement)
- User accounts: Until deletion requested

### Data Access

- **Travelers**: Own data only
- **Immigration Officers**: Arrival cards at assigned border post
- **ZIMRA Officers**: Customs declaration data only
- **Government Officials**: Aggregated statistics (no PII)
- **Administrators**: Full access with audit logging

## Compliance

This system is designed to comply with:

- Zimbabwe Data Protection Act
- GDPR principles (for EU travelers)
- POPIA (for South African travelers)
- International travel document standards

## Security Checklist for Contributors

Before submitting code, ensure:

- [ ] No hardcoded secrets or credentials
- [ ] All user inputs are validated
- [ ] Database queries use Prisma (no raw SQL)
- [ ] Authentication checks on protected routes
- [ ] Role-based authorization where needed
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include PII
- [ ] Dependencies are up to date

## Contact

- **Security Issues**: security@nyuchi.com
- **General Inquiries**: bryan@nyuchi.com
- **GitHub**: https://github.com/nyuchitech/zimbabwe-arrival-card

---

*Last updated: January 2026*
