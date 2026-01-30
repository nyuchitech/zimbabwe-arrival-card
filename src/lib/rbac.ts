import { Role } from "@/generated/prisma/client";

// Define permissions for each role
export const ROLE_PERMISSIONS = {
  TRAVELER: [
    "arrival-card:create",
    "arrival-card:read:own",
    "arrival-card:update:own",
    "arrival-card:delete:own",
    "profile:read:own",
    "profile:update:own",
  ],
  IMMIGRATION: [
    "arrival-card:read:all",
    "arrival-card:review",
    "arrival-card:approve",
    "arrival-card:reject",
    "traveler:read:all",
    "profile:read:own",
    "profile:update:own",
    "border-post:read:assigned",
    "reports:read:border-post",
  ],
  GOVERNMENT: [
    "arrival-card:read:all",
    "traveler:read:all",
    "reports:read:all",
    "analytics:read:all",
    "border-post:read:all",
    "profile:read:own",
    "profile:update:own",
  ],
  ADMIN: [
    "arrival-card:read:all",
    "arrival-card:update:all",
    "arrival-card:delete:all",
    "traveler:read:all",
    "traveler:create",
    "traveler:update:all",
    "traveler:delete:all",
    "user:read:all",
    "user:create",
    "user:update:all",
    "user:delete:all",
    "border-post:read:all",
    "border-post:create",
    "border-post:update:all",
    "border-post:delete:all",
    "reports:read:all",
    "analytics:read:all",
    "settings:read:all",
    "settings:update:all",
    "audit-log:read:all",
    "profile:read:own",
    "profile:update:own",
  ],
} as const;

export type Permission =
  (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS][number];

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] as readonly string[];
  return permissions.includes(permission);
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

// Check if a role has all of the specified permissions
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

// Get all permissions for a role
export function getPermissions(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

// Role hierarchy - higher roles inherit lower role permissions (optional use)
export const ROLE_HIERARCHY: Record<Role, number> = {
  TRAVELER: 1,
  IMMIGRATION: 2,
  GOVERNMENT: 3,
  ADMIN: 4,
};

// Check if a role is at least at a certain level
export function isAtLeastRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Get role display name
export function getRoleDisplayName(role: Role): string {
  const displayNames: Record<Role, string> = {
    TRAVELER: "Traveler",
    IMMIGRATION: "Immigration Officer",
    GOVERNMENT: "Government Official",
    ADMIN: "System Administrator",
  };
  return displayNames[role];
}

// Get role badge color (for UI)
export function getRoleBadgeColor(role: Role): string {
  const colors: Record<Role, string> = {
    TRAVELER: "bg-blue-100 text-blue-800",
    IMMIGRATION: "bg-green-100 text-green-800",
    GOVERNMENT: "bg-purple-100 text-purple-800",
    ADMIN: "bg-red-100 text-red-800",
  };
  return colors[role];
}
