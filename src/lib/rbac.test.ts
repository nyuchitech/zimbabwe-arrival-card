import { describe, it, expect } from "vitest";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissions,
  isAtLeastRole,
  getRoleDisplayName,
  getRoleBadgeColor,
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
} from "./rbac";

describe("RBAC - hasPermission", () => {
  it("should return true when TRAVELER has arrival-card:create permission", () => {
    expect(hasPermission("TRAVELER", "arrival-card:create")).toBe(true);
  });

  it("should return false when TRAVELER tries to access arrival-card:read:all", () => {
    expect(hasPermission("TRAVELER", "arrival-card:read:all")).toBe(false);
  });

  it("should return true when IMMIGRATION has arrival-card:approve permission", () => {
    expect(hasPermission("IMMIGRATION", "arrival-card:approve")).toBe(true);
  });

  it("should return true when GOVERNMENT has analytics:read:all permission", () => {
    expect(hasPermission("GOVERNMENT", "analytics:read:all")).toBe(true);
  });

  it("should return true when ADMIN has user:delete:all permission", () => {
    expect(hasPermission("ADMIN", "user:delete:all")).toBe(true);
  });

  it("should return true for profile:read:own across all roles", () => {
    const roles = ["TRAVELER", "IMMIGRATION", "GOVERNMENT", "ADMIN"] as const;
    roles.forEach((role) => {
      expect(hasPermission(role, "profile:read:own")).toBe(true);
    });
  });
});

describe("RBAC - hasAnyPermission", () => {
  it("should return true when role has at least one of the permissions", () => {
    expect(
      hasAnyPermission("TRAVELER", [
        "arrival-card:create",
        "arrival-card:read:all",
      ])
    ).toBe(true);
  });

  it("should return false when role has none of the permissions", () => {
    expect(
      hasAnyPermission("TRAVELER", [
        "arrival-card:read:all",
        "user:delete:all",
      ])
    ).toBe(false);
  });

  it("should return true for ADMIN with any permissions", () => {
    expect(
      hasAnyPermission("ADMIN", ["user:create", "settings:update:all"])
    ).toBe(true);
  });
});

describe("RBAC - hasAllPermissions", () => {
  it("should return true when role has all permissions", () => {
    expect(
      hasAllPermissions("TRAVELER", [
        "arrival-card:create",
        "arrival-card:read:own",
      ])
    ).toBe(true);
  });

  it("should return false when role is missing any permission", () => {
    expect(
      hasAllPermissions("TRAVELER", [
        "arrival-card:create",
        "arrival-card:read:all",
      ])
    ).toBe(false);
  });

  it("should return true for ADMIN with multiple permissions", () => {
    expect(
      hasAllPermissions("ADMIN", [
        "user:create",
        "user:delete:all",
        "settings:update:all",
      ])
    ).toBe(true);
  });
});

describe("RBAC - getPermissions", () => {
  it("should return all permissions for TRAVELER", () => {
    const permissions = getPermissions("TRAVELER");
    expect(permissions).toContain("arrival-card:create");
    expect(permissions).toContain("profile:read:own");
    expect(permissions.length).toBe(ROLE_PERMISSIONS.TRAVELER.length);
  });

  it("should return all permissions for ADMIN", () => {
    const permissions = getPermissions("ADMIN");
    expect(permissions).toContain("user:delete:all");
    expect(permissions).toContain("audit-log:read:all");
    expect(permissions.length).toBe(ROLE_PERMISSIONS.ADMIN.length);
  });
});

describe("RBAC - isAtLeastRole", () => {
  it("should return true when user role is higher than required", () => {
    expect(isAtLeastRole("ADMIN", "TRAVELER")).toBe(true);
    expect(isAtLeastRole("GOVERNMENT", "IMMIGRATION")).toBe(true);
  });

  it("should return true when user role equals required role", () => {
    expect(isAtLeastRole("IMMIGRATION", "IMMIGRATION")).toBe(true);
    expect(isAtLeastRole("ADMIN", "ADMIN")).toBe(true);
  });

  it("should return false when user role is lower than required", () => {
    expect(isAtLeastRole("TRAVELER", "IMMIGRATION")).toBe(false);
    expect(isAtLeastRole("IMMIGRATION", "GOVERNMENT")).toBe(false);
  });

  it("should follow the correct hierarchy", () => {
    expect(ROLE_HIERARCHY.TRAVELER).toBeLessThan(ROLE_HIERARCHY.IMMIGRATION);
    expect(ROLE_HIERARCHY.IMMIGRATION).toBeLessThan(ROLE_HIERARCHY.GOVERNMENT);
    expect(ROLE_HIERARCHY.GOVERNMENT).toBeLessThan(ROLE_HIERARCHY.ADMIN);
  });
});

describe("RBAC - getRoleDisplayName", () => {
  it("should return correct display name for TRAVELER", () => {
    expect(getRoleDisplayName("TRAVELER")).toBe("Traveler");
  });

  it("should return correct display name for IMMIGRATION", () => {
    expect(getRoleDisplayName("IMMIGRATION")).toBe("Immigration Officer");
  });

  it("should return correct display name for GOVERNMENT", () => {
    expect(getRoleDisplayName("GOVERNMENT")).toBe("Government Official");
  });

  it("should return correct display name for ADMIN", () => {
    expect(getRoleDisplayName("ADMIN")).toBe("System Administrator");
  });
});

describe("RBAC - getRoleBadgeColor", () => {
  it("should return blue colors for TRAVELER", () => {
    expect(getRoleBadgeColor("TRAVELER")).toContain("blue");
  });

  it("should return green colors for IMMIGRATION", () => {
    expect(getRoleBadgeColor("IMMIGRATION")).toContain("green");
  });

  it("should return purple colors for GOVERNMENT", () => {
    expect(getRoleBadgeColor("GOVERNMENT")).toContain("purple");
  });

  it("should return red colors for ADMIN", () => {
    expect(getRoleBadgeColor("ADMIN")).toContain("red");
  });
});

describe("RBAC - Permission Boundaries", () => {
  it("TRAVELER should only have own-scoped permissions", () => {
    const permissions = getPermissions("TRAVELER");
    const allScopedPermissions = permissions.filter(
      (p) => p.includes(":all") && !p.includes(":own")
    );
    expect(allScopedPermissions.length).toBe(0);
  });

  it("IMMIGRATION should have review capabilities", () => {
    const permissions = getPermissions("IMMIGRATION");
    expect(permissions).toContain("arrival-card:review");
    expect(permissions).toContain("arrival-card:approve");
    expect(permissions).toContain("arrival-card:reject");
  });

  it("GOVERNMENT should have read-only analytics access", () => {
    const permissions = getPermissions("GOVERNMENT");
    expect(permissions).toContain("reports:read:all");
    expect(permissions).toContain("analytics:read:all");
    // Should not have write permissions
    expect(permissions).not.toContain("arrival-card:approve");
    expect(permissions).not.toContain("user:create");
  });

  it("ADMIN should have full system access", () => {
    const permissions = getPermissions("ADMIN");
    expect(permissions).toContain("user:create");
    expect(permissions).toContain("user:delete:all");
    expect(permissions).toContain("settings:update:all");
    expect(permissions).toContain("audit-log:read:all");
  });
});
