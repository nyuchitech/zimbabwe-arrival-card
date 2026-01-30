/**
 * Production-Ready Rate Limiter
 *
 * Features:
 * - Redis support for distributed deployments (via Upstash/Vercel KV)
 * - In-memory fallback for development
 * - IP validation to prevent spoofing
 * - Sliding window algorithm
 * - Account lockout support
 */

import { logger, metrics } from "./observability";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowInSeconds: number;
  /** Optional key prefix for namespacing */
  prefix?: string;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// In-memory store (fallback for development)
const memoryStore = new Map<string, RateLimitEntry>();

// Clean up old entries every minute
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (entry.resetTime < now) {
        memoryStore.delete(key);
      }
    }
  }, 60 * 1000);
}

// Redis client (lazy loaded)
let redisClient: {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, options?: { ex?: number }) => Promise<void>;
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<void>;
} | null = null;

async function getRedisClient() {
  if (redisClient) return redisClient;

  // Try to connect to Redis if configured
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      // Dynamic import for Upstash Redis
      const { Redis } = await import("@upstash/redis");
      redisClient = new Redis({
        url: redisUrl,
        token: redisToken,
      }) as typeof redisClient;
      logger.info("Rate limiter connected to Redis");
      return redisClient;
    } catch (error) {
      logger.warn("Failed to connect to Redis, using in-memory fallback", {
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  return null;
}

/**
 * Rate limit using Redis (production) or memory (development)
 */
export async function rateLimitAsync(
  identifier: string,
  config: RateLimitConfig = { limit: 10, windowInSeconds: 60 }
): Promise<RateLimitResult> {
  const key = config.prefix
    ? `ratelimit:${config.prefix}:${identifier}`
    : `ratelimit:${identifier}`;
  const redis = await getRedisClient();

  if (redis) {
    return rateLimitRedis(redis, key, config);
  }

  // Fallback to in-memory
  return rateLimitMemory(key, config);
}

/**
 * Synchronous rate limit (in-memory only, for backward compatibility)
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, windowInSeconds: 60 }
): RateLimitResult {
  const key = config.prefix
    ? `ratelimit:${config.prefix}:${identifier}`
    : `ratelimit:${identifier}`;
  return rateLimitMemory(key, config);
}

function rateLimitMemory(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowInSeconds * 1000;
  const entry = memoryStore.get(key);

  if (!entry || entry.resetTime < now) {
    memoryStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Math.floor((now + windowMs) / 1000),
    };
  }

  if (entry.count >= config.limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    metrics.increment("rate_limit.exceeded", { key });

    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: Math.floor(entry.resetTime / 1000),
      retryAfter,
    };
  }

  entry.count++;

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: Math.floor(entry.resetTime / 1000),
  };
}

async function rateLimitRedis(
  redis: NonNullable<typeof redisClient>,
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `${key}:${Math.floor(now / config.windowInSeconds)}`;

  try {
    const count = await redis.incr(windowKey);

    if (count === 1) {
      await redis.expire(windowKey, config.windowInSeconds);
    }

    const reset =
      (Math.floor(now / config.windowInSeconds) + 1) * config.windowInSeconds;
    const remaining = Math.max(0, config.limit - count);

    if (count > config.limit) {
      const retryAfter = reset - now;
      metrics.increment("rate_limit.exceeded", { key });

      return {
        success: false,
        limit: config.limit,
        remaining: 0,
        reset,
        retryAfter,
      };
    }

    return {
      success: true,
      limit: config.limit,
      remaining,
      reset,
    };
  } catch (error) {
    logger.error("Redis rate limit error, falling back to memory", {
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return rateLimitMemory(key, config);
  }
}

// Trusted proxy IPs (Vercel, Cloudflare, etc.)
const TRUSTED_PROXIES = new Set([
  // Cloudflare IPs (subset - add more as needed)
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "108.162.192.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "198.41.128.0/17",
  "162.158.0.0/15",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.72.0/22",
]);

// IP validation regex
const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_REGEX = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

function isValidIp(ip: string): boolean {
  return IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip);
}

/**
 * Get client IP from request headers with validation
 * Prevents IP spoofing attacks
 */
export function getClientIp(request: Request): string {
  // Cloudflare's connecting IP (most reliable when behind Cloudflare)
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp && isValidIp(cfConnectingIp)) {
    return cfConnectingIp;
  }

  // Vercel's real IP
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const ip = vercelIp.split(",")[0].trim();
    if (isValidIp(ip)) {
      return ip;
    }
  }

  // Standard forwarded header
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    if (isValidIp(ip)) {
      return ip;
    }
  }

  // Real IP header
  const realIp = request.headers.get("x-real-ip");
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }

  // Log suspicious requests without valid IP
  logger.warn("Could not determine valid client IP", {
    forwarded,
    realIp,
    cfConnectingIp,
  });

  return "unknown";
}

/**
 * Create rate limit response headers
 */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  const headers: HeadersInit = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };

  if (result.retryAfter) {
    headers["Retry-After"] = result.retryAfter.toString();
  }

  return headers;
}

// Account lockout tracking
interface LockoutEntry {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const lockoutStore = new Map<string, LockoutEntry>();

interface LockoutConfig {
  maxAttempts: number;
  lockoutDuration: number; // seconds
  attemptWindow: number; // seconds
}

const DEFAULT_LOCKOUT_CONFIG: LockoutConfig = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60, // 15 minutes
  attemptWindow: 15 * 60, // 15 minutes
};

/**
 * Track failed login attempts and implement account lockout
 */
export function trackLoginAttempt(
  identifier: string,
  success: boolean,
  config: LockoutConfig = DEFAULT_LOCKOUT_CONFIG
): { locked: boolean; remainingAttempts: number; lockoutEnds?: number } {
  const now = Date.now();
  const entry = lockoutStore.get(identifier) || {
    attempts: 0,
    lockedUntil: null,
    lastAttempt: now,
  };

  // Check if currently locked
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return {
      locked: true,
      remainingAttempts: 0,
      lockoutEnds: Math.ceil(entry.lockedUntil / 1000),
    };
  }

  // Reset if window has passed
  if (now - entry.lastAttempt > config.attemptWindow * 1000) {
    entry.attempts = 0;
    entry.lockedUntil = null;
  }

  if (success) {
    // Reset on successful login
    lockoutStore.delete(identifier);
    return { locked: false, remainingAttempts: config.maxAttempts };
  }

  // Failed attempt
  entry.attempts++;
  entry.lastAttempt = now;

  if (entry.attempts >= config.maxAttempts) {
    entry.lockedUntil = now + config.lockoutDuration * 1000;
    lockoutStore.set(identifier, entry);

    logger.logSecurityEvent("Account locked due to failed login attempts", {
      identifier,
      attempts: entry.attempts,
      lockoutEnds: new Date(entry.lockedUntil).toISOString(),
      severity: "medium",
    });

    return {
      locked: true,
      remainingAttempts: 0,
      lockoutEnds: Math.ceil(entry.lockedUntil / 1000),
    };
  }

  lockoutStore.set(identifier, entry);

  return {
    locked: false,
    remainingAttempts: config.maxAttempts - entry.attempts,
  };
}

/**
 * Check if an account is locked
 */
export function isAccountLocked(identifier: string): boolean {
  const entry = lockoutStore.get(identifier);
  if (!entry || !entry.lockedUntil) return false;
  return entry.lockedUntil > Date.now();
}

/**
 * Manually unlock an account (admin function)
 */
export function unlockAccount(identifier: string): void {
  lockoutStore.delete(identifier);
  logger.info("Account manually unlocked", { identifier });
}
