/**
 * Audit Logging Module
 * Provides comprehensive audit trail for security and compliance
 */

import { logger } from "./observability";
import { getClientIp } from "./rate-limit";

type AuditAction =
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FAILED"
  | "REGISTER"
  | "APPROVE"
  | "REJECT"
  | "SUBMIT"
  | "EXPORT"
  | "VERIFY"
  | "LOOKUP";

type EntityType =
  | "User"
  | "ArrivalCard"
  | "BorderPost"
  | "Companion"
  | "SystemSetting";

interface AuditContext {
  userId?: string;
  userRole?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

interface AuditLogEntry {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  context: AuditContext;
  metadata?: Record<string, unknown>;
}

// Sensitive fields that should be redacted in audit logs
const SENSITIVE_FIELDS = new Set([
  "password",
  "passwordHash",
  "token",
  "secret",
  "apiKey",
  "creditCard",
  "ssn",
  "passportNumber",
]);

function redactSensitiveData(
  data: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!data) return undefined;

  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
      redacted[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      redacted[key] = redactSensitiveData(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

/**
 * Create an audit log entry
 * Stores in database and logs for observability
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  const timestamp = new Date().toISOString();

  // Redact sensitive data
  const safeEntry = {
    ...entry,
    oldData: redactSensitiveData(entry.oldData),
    newData: redactSensitiveData(entry.newData),
  };

  // Log to observability system
  logger.info(`AUDIT: ${entry.action} ${entry.entityType}`, {
    ...safeEntry,
    timestamp,
  });

  // Store in database (if available)
  try {
    const { db } = await import("@/lib/db");

    if (entry.context.userId) {
      await db.auditLog.create({
        data: {
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId || "",
          oldData: entry.oldData ? JSON.stringify(safeEntry.oldData) : null,
          newData: entry.newData ? JSON.stringify(safeEntry.newData) : null,
          ipAddress: entry.context.ipAddress,
          userAgent: entry.context.userAgent,
          userId: entry.context.userId,
        },
      });
    }
  } catch (error) {
    // Don't fail the request if audit logging fails
    logger.error("Failed to store audit log in database", {
      error: error instanceof Error ? error : new Error(String(error)),
      entry: safeEntry,
    });
  }
}

// Convenience functions for common audit actions

export async function auditLogin(
  userId: string,
  success: boolean,
  context: AuditContext
): Promise<void> {
  await createAuditLog({
    action: success ? "LOGIN" : "LOGIN_FAILED",
    entityType: "User",
    entityId: userId,
    context,
    metadata: { success },
  });
}

export async function auditRegister(
  userId: string,
  email: string,
  context: AuditContext
): Promise<void> {
  await createAuditLog({
    action: "REGISTER",
    entityType: "User",
    entityId: userId,
    newData: { email },
    context,
  });
}

export async function auditArrivalCardCreate(
  cardId: string,
  referenceNumber: string,
  context: AuditContext
): Promise<void> {
  await createAuditLog({
    action: "CREATE",
    entityType: "ArrivalCard",
    entityId: cardId,
    newData: { referenceNumber },
    context,
  });
}

export async function auditArrivalCardSubmit(
  cardId: string,
  referenceNumber: string,
  context: AuditContext
): Promise<void> {
  await createAuditLog({
    action: "SUBMIT",
    entityType: "ArrivalCard",
    entityId: cardId,
    newData: { referenceNumber, status: "SUBMITTED" },
    context,
  });
}

export async function auditArrivalCardStatusChange(
  cardId: string,
  oldStatus: string,
  newStatus: string,
  context: AuditContext,
  reason?: string
): Promise<void> {
  await createAuditLog({
    action: newStatus === "APPROVED" ? "APPROVE" : "REJECT",
    entityType: "ArrivalCard",
    entityId: cardId,
    oldData: { status: oldStatus },
    newData: { status: newStatus, reason },
    context,
  });
}

export async function auditArrivalCardLookup(
  referenceNumber: string,
  found: boolean,
  context: AuditContext
): Promise<void> {
  await createAuditLog({
    action: "LOOKUP",
    entityType: "ArrivalCard",
    entityId: referenceNumber,
    context,
    metadata: { found },
  });
}

export async function auditArrivalCardVerify(
  cardId: string,
  context: AuditContext
): Promise<void> {
  await createAuditLog({
    action: "VERIFY",
    entityType: "ArrivalCard",
    entityId: cardId,
    context,
  });
}

/**
 * Extract audit context from a request
 */
export function getAuditContext(
  request: Request,
  user?: { id: string; role: string; email?: string }
): AuditContext {
  return {
    userId: user?.id,
    userRole: user?.role,
    userEmail: user?.email,
    ipAddress: getClientIp(request),
    userAgent: request.headers.get("user-agent") || undefined,
    requestId: request.headers.get("x-request-id") || undefined,
  };
}
