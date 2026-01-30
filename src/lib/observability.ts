/**
 * Observability and Monitoring Module
 * Implements structured logging, metrics, and tracing for production reliability
 * Inspired by Netflix's observability practices
 */

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface LogContext {
  requestId?: string;
  userId?: string;
  userRole?: string;
  path?: string;
  method?: string;
  duration?: number;
  statusCode?: number;
  error?: Error;
  [key: string]: unknown;
}

interface MetricData {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: number;
}

// Structured logger for production observability
class Logger {
  private serviceName = "zimbabwe-arrival-card";
  private environment = process.env.NODE_ENV || "development";

  private formatLog(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      environment: this.environment,
      message,
      ...context,
      // Sanitize error objects
      error: context?.error
        ? {
            name: context.error.name,
            message: context.error.message,
            stack:
              this.environment === "development"
                ? context.error.stack
                : undefined,
          }
        : undefined,
    };

    return JSON.stringify(logEntry);
  }

  debug(message: string, context?: LogContext) {
    if (this.environment === "development") {
      console.debug(this.formatLog("debug", message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.info(this.formatLog("info", message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatLog("warn", message, context));
  }

  error(message: string, context?: LogContext) {
    console.error(this.formatLog("error", message, context));
  }

  fatal(message: string, context?: LogContext) {
    console.error(this.formatLog("fatal", message, context));
  }

  // Request logging helper
  logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: Omit<LogContext, "method" | "path" | "statusCode" | "duration">
  ) {
    const level: LogLevel = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    this[level](`${method} ${path} ${statusCode} ${duration}ms`, {
      method,
      path,
      statusCode,
      duration,
      ...context,
    });
  }

  // Security event logging
  logSecurityEvent(
    event: string,
    context: LogContext & { severity: "low" | "medium" | "high" | "critical" }
  ) {
    this.warn(`SECURITY: ${event}`, {
      ...context,
      securityEvent: true,
    });
  }
}

// Metrics collector for monitoring
class MetricsCollector {
  private metrics: MetricData[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Flush metrics every 60 seconds in production
    if (process.env.NODE_ENV === "production") {
      this.flushInterval = setInterval(() => this.flush(), 60000);
    }
  }

  increment(name: string, tags?: Record<string, string>) {
    this.record({ name, value: 1, tags });
  }

  gauge(name: string, value: number, tags?: Record<string, string>) {
    this.record({ name, value, tags });
  }

  timing(name: string, durationMs: number, tags?: Record<string, string>) {
    this.record({ name: `${name}.timing`, value: durationMs, tags });
  }

  private record(metric: MetricData) {
    this.metrics.push({
      ...metric,
      timestamp: Date.now(),
    });

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  flush() {
    if (this.metrics.length === 0) return;

    // In production, send to metrics service (DataDog, CloudWatch, etc.)
    if (process.env.METRICS_ENDPOINT) {
      // Placeholder for metrics export
      // fetch(process.env.METRICS_ENDPOINT, {
      //   method: 'POST',
      //   body: JSON.stringify(this.metrics),
      // });
    }

    this.metrics = [];
  }

  getMetrics() {
    return [...this.metrics];
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }
}

// Request ID generator for tracing
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Performance timer
export function createTimer() {
  const start = performance.now();
  return {
    elapsed: () => Math.round(performance.now() - start),
  };
}

// Singleton instances
export const logger = new Logger();
export const metrics = new MetricsCollector();

// Health status tracking
interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  checks: Record<string, {
    status: "pass" | "fail" | "warn";
    latency?: number;
    message?: string;
    lastCheck: string;
  }>;
  uptime: number;
  version: string;
}

class HealthChecker {
  private startTime = Date.now();
  private lastChecks: HealthStatus["checks"] = {};

  async checkDatabase(): Promise<{ status: "pass" | "fail"; latency: number; message?: string }> {
    const timer = createTimer();
    try {
      // Dynamic import to avoid build-time issues
      const { db } = await import("@/lib/db");
      await db.$queryRaw`SELECT 1`;
      return { status: "pass", latency: timer.elapsed() };
    } catch (error) {
      return {
        status: "fail",
        latency: timer.elapsed(),
        message: error instanceof Error ? error.message : "Database connection failed",
      };
    }
  }

  async checkEmail(): Promise<{ status: "pass" | "fail" | "warn"; latency: number; message?: string }> {
    const timer = createTimer();

    if (!process.env.RESEND_API_KEY) {
      return { status: "warn", latency: timer.elapsed(), message: "Email not configured" };
    }

    // Just check if API key is set, don't make actual API call
    return { status: "pass", latency: timer.elapsed() };
  }

  async getHealth(): Promise<HealthStatus> {
    const [dbCheck, emailCheck] = await Promise.all([
      this.checkDatabase(),
      this.checkEmail(),
    ]);

    const now = new Date().toISOString();

    this.lastChecks = {
      database: { ...dbCheck, lastCheck: now },
      email: { ...emailCheck, lastCheck: now },
    };

    const allPassing = Object.values(this.lastChecks).every(
      (check) => check.status === "pass"
    );
    const anyFailing = Object.values(this.lastChecks).some(
      (check) => check.status === "fail"
    );

    return {
      status: anyFailing ? "unhealthy" : allPassing ? "healthy" : "degraded",
      checks: this.lastChecks,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: process.env.npm_package_version || "0.3.0",
    };
  }

  // Lightweight liveness check (is the service running?)
  getLiveness() {
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  // Readiness check (is the service ready to accept traffic?)
  async getReadiness(): Promise<{ ready: boolean; reason?: string }> {
    try {
      const { db } = await import("@/lib/db");
      await db.$queryRaw`SELECT 1`;
      return { ready: true };
    } catch {
      return { ready: false, reason: "Database not available" };
    }
  }
}

export const healthChecker = new HealthChecker();

// Error tracking helper
export function captureException(
  error: Error,
  context?: Record<string, unknown>
) {
  logger.error("Exception captured", {
    error,
    ...context,
  });

  metrics.increment("errors.total", {
    type: error.name,
  });

  // In production, send to error tracking service (Sentry, etc.)
  if (process.env.SENTRY_DSN) {
    // Placeholder for Sentry integration
    // Sentry.captureException(error, { extra: context });
  }
}
