# Release Process

This document describes the release process for the Zimbabwe e-Arrival Card system.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes, major new features
- **MINOR** (0.1.0): New features, backward-compatible
- **PATCH** (0.0.1): Bug fixes, security patches

## Release Schedule

| Type | Frequency | Day |
|------|-----------|-----|
| Major | As needed | Announced 2 weeks prior |
| Minor | Monthly | First Monday |
| Patch | As needed | Any day (security: immediate) |

## Release Checklist

### Pre-Release

- [ ] All tests passing (`npm run test:run`)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Documentation updated
- [ ] Security review completed
- [ ] Database migrations tested

### Release

1. **Create Release Branch**
   ```bash
   git checkout -b release/v0.x.x
   ```

2. **Update Version**
   ```bash
   npm version minor  # or major/patch
   ```

3. **Update CHANGELOG.md**
   - Move items from [Unreleased] to new version section
   - Add release date
   - Update comparison links

4. **Create Pull Request**
   - Title: `Release v0.x.x`
   - Description: Summary of changes
   - Label: `release`

5. **Merge to Main**
   - Require 2 approvals for major releases
   - Require 1 approval for minor/patch

6. **Create GitHub Release**
   ```bash
   gh release create v0.x.x --title "v0.x.x" --notes-file RELEASE_NOTES.md
   ```

7. **Deploy to Production**
   - Vercel auto-deploys from main
   - Monitor for errors
   - Verify critical paths

### Post-Release

- [ ] Verify production deployment
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Announce release (if major)
- [ ] Update project board

## Environments

| Environment | Branch | URL | Auto-Deploy |
|-------------|--------|-----|-------------|
| Production | main | arrival.zimbabwe.gov.zw | Yes |
| Staging | staging | staging.arrival.zimbabwe.gov.zw | Yes |
| Preview | PR branches | *.vercel.app | Yes |

## Hotfix Process

For critical security or bug fixes:

1. Create branch from main: `hotfix/description`
2. Make minimal fix
3. Test thoroughly
4. Create PR with `hotfix` label
5. Get expedited review
6. Merge and deploy immediately
7. Backport to development if needed

## Rollback Procedure

If a release causes issues:

1. **Immediate**: Revert via Vercel dashboard
2. **Code Revert**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. **Database**: Apply rollback migration if needed
4. **Notify**: Alert team and stakeholders

## Release Notes Template

```markdown
# v0.x.x Release Notes

**Release Date:** YYYY-MM-DD

## Highlights

- Major feature or change

## New Features

- Feature description (#PR)

## Improvements

- Improvement description (#PR)

## Bug Fixes

- Fix description (#PR)

## Security

- Security update description

## Breaking Changes

- Breaking change and migration path

## Dependencies

- Updated package@version

## Contributors

Thanks to @contributor for their contributions!
```

## Communication

### Internal

- Slack: #zimbabwe-arrival-releases
- Email: dev-team@nyuchi.com

### External

- Status page: status.zimbabwe.gov.zw
- Support email: support@immigration.gov.zw

## Metrics to Monitor

After each release, monitor:

- Error rate (should remain < 0.1%)
- Response times (P95 < 500ms)
- Successful form submissions
- Authentication success rate
- Database connection pool usage

---

*Last updated: January 2026*
