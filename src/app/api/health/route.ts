/**
 * Health Check API Endpoints
 * Provides Kubernetes-style health probes for production deployment
 *
 * Endpoints:
 * - GET /api/health - Full health check with all dependencies
 * - GET /api/health?probe=liveness - Lightweight liveness check
 * - GET /api/health?probe=readiness - Readiness check for traffic
 */

import { NextRequest, NextResponse } from "next/server";
import { healthChecker, metrics, logger } from "@/lib/observability";
import { circuits, bulkheads } from "@/lib/circuit-breaker";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const probe = request.nextUrl.searchParams.get("probe");

  try {
    // Liveness probe - is the service running?
    if (probe === "liveness") {
      const liveness = healthChecker.getLiveness();
      return NextResponse.json(liveness, { status: 200 });
    }

    // Readiness probe - is the service ready to accept traffic?
    if (probe === "readiness") {
      const readiness = await healthChecker.getReadiness();
      return NextResponse.json(readiness, {
        status: readiness.ready ? 200 : 503,
      });
    }

    // Full health check
    const health = await healthChecker.getHealth();

    // Include circuit breaker stats
    const circuitStats = {
      database: circuits.database.getStats(),
      email: circuits.email.getStats(),
    };

    // Include bulkhead stats
    const bulkheadStats = {
      database: bulkheads.database.getStats(),
      email: bulkheads.email.getStats(),
    };

    // Include recent metrics summary
    const recentMetrics = metrics.getMetrics().slice(-10);

    const response = {
      ...health,
      circuits: circuitStats,
      bulkheads: bulkheadStats,
      recentMetrics: recentMetrics.length,
      timestamp: new Date().toISOString(),
    };

    // Determine HTTP status based on health
    const status =
      health.status === "healthy"
        ? 200
        : health.status === "degraded"
        ? 200
        : 503;

    // Log health check
    if (health.status !== "healthy") {
      logger.warn("Health check returned non-healthy status", {
        status: health.status,
        checks: health.checks,
      });
    }

    return NextResponse.json(response, {
      status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    logger.error("Health check failed", {
      error: error instanceof Error ? error : new Error(String(error)),
    });

    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
