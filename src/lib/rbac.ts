import { Role } from "@/generated/prisma/client";

// Define permissions for each role
export const ROLE_PERMISSIONS = {
  USER: [
    "trip:create",
    "trip:read:own",
    "trip:update:own",
    "trip:delete:own",
    "profile:read:own",
    "profile:update:own",
  ],
  IMMIGRATION: [
    "trip:read:all",
    "trip:review",
    "trip:approve",
    "trip:reject",
    "user:read:all",
    "profile:read:own",
    "profile:update:own",
    "border-post:read:assigned",
    "reports:read:border-post",
    "scan:qr",
  ],
  GOVERNMENT: [
    "trip:read:all",
    "user:read:all",
    "reports:read:all",
    "analytics:read:all",
    "border-post:read:all",
    "profile:read:own",
    "profile:update:own",
  ],
  ZIMRA: [
    "trip:read:all",
    "customs:read:all",
    "customs:review",
    "customs:flag",
    "user:read:all",
    "reports:read:customs",
    "analytics:read:customs",
    "border-post:read:all",
    "profile:read:own",
    "profile:update:own",
  ],
  ADMIN: [
    "trip:read:all",
    "trip:update:all",
    "trip:delete:all",
    "trip:review",
    "trip:approve",
    "trip:reject",
    "user:read:all",
    "user:create",
    "user:update:all",
    "user:delete:all",
    "border-post:read:all",
    "border-post:create",
    "border-post:update:all",
    "border-post:delete:all",
    "customs:read:all",
    "customs:review",
    "reports:read:all",
    "analytics:read:all",
    "settings:read:all",
    "settings:update:all",
    "audit-log:read:all",
    "profile:read:own",
    "profile:update:own",
    "scan:qr",
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
  USER: 1,
  IMMIGRATION: 2,
  ZIMRA: 2,
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
    USER: "User",
    IMMIGRATION: "Immigration Officer",
    GOVERNMENT: "Government Official",
    ZIMRA: "ZIMRA Officer",
    ADMIN: "System Administrator",
  };
  return displayNames[role];
}

// Get role badge color (for UI)
export function getRoleBadgeColor(role: Role): string {
  const colors: Record<Role, string> = {
    USER: "bg-blue-100 text-blue-800",
    IMMIGRATION: "bg-green-100 text-green-800",
    GOVERNMENT: "bg-purple-100 text-purple-800",
    ZIMRA: "bg-yellow-100 text-yellow-800",
    ADMIN: "bg-red-100 text-red-800",
  };
  return colors[role];
}

// Check if role is a staff role (not a regular user)
export function isStaffRole(role: Role): boolean {
  return role !== "USER";
}
