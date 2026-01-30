/**
 * Circuit Breaker Pattern Implementation
 * Inspired by Netflix Hystrix - provides fault tolerance for external services
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Circuit is open, requests fail fast
 * - HALF_OPEN: Testing if service has recovered
 */

import { logger, metrics } from "./observability";

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface CircuitBreakerConfig {
  /** Name of the circuit (for logging/metrics) */
  name: string;
  /** Number of failures before opening circuit */
  failureThreshold: number;
  /** Time in ms before attempting recovery */
  resetTimeout: number;
  /** Number of successful calls to close circuit from half-open */
  successThreshold: number;
  /** Timeout for each call in ms */
  timeout: number;
  /** Custom fallback function */
  fallback?: () => unknown;
}

interface CircuitStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  totalCalls: number;
  totalFailures: number;
  totalSuccesses: number;
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failures = 0;
  private successes = 0;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = null;
  private totalCalls = 0;
  private totalFailures = 0;
  private totalSuccesses = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> & { name: string }) {
    this.config = {
      failureThreshold: 5,
      resetTimeout: 30000, // 30 seconds
      successThreshold: 3,
      timeout: 10000, // 10 seconds
      ...config,
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalCalls++;

    // Check if circuit should transition from OPEN to HALF_OPEN
    if (this.state === "OPEN") {
      if (this.shouldAttemptReset()) {
        this.transitionTo("HALF_OPEN");
      } else {
        this.recordRejection();
        throw new CircuitOpenError(this.config.name);
      }
    }

    try {
      const result = await this.executeWithTimeout(fn);
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure(error as Error);
      throw error;
    }
  }

  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new TimeoutError(this.config.name, this.config.timeout));
      }, this.config.timeout);

      fn()
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    return Date.now() - this.lastFailureTime >= this.config.resetTimeout;
  }

  private recordSuccess() {
    this.successes++;
    this.totalSuccesses++;
    this.lastSuccessTime = Date.now();

    metrics.increment(`circuit.${this.config.name}.success`);

    if (this.state === "HALF_OPEN") {
      if (this.successes >= this.config.successThreshold) {
        this.transitionTo("CLOSED");
      }
    } else if (this.state === "CLOSED") {
      // Reset failure count on success
      this.failures = 0;
    }
  }

  private recordFailure(error: Error) {
    this.failures++;
    this.totalFailures++;
    this.lastFailureTime = Date.now();

    metrics.increment(`circuit.${this.config.name}.failure`, {
      error: error.name,
    });

    logger.warn(`Circuit breaker failure: ${this.config.name}`, {
      error,
      state: this.state,
      failures: this.failures,
      threshold: this.config.failureThreshold,
    });

    if (this.state === "HALF_OPEN") {
      // Any failure in half-open state opens the circuit
      this.transitionTo("OPEN");
    } else if (this.state === "CLOSED") {
      if (this.failures >= this.config.failureThreshold) {
        this.transitionTo("OPEN");
      }
    }
  }

  private recordRejection() {
    metrics.increment(`circuit.${this.config.name}.rejected`);
  }

  private transitionTo(newState: CircuitState) {
    const oldState = this.state;
    this.state = newState;

    if (newState === "CLOSED") {
      this.failures = 0;
      this.successes = 0;
    } else if (newState === "HALF_OPEN") {
      this.successes = 0;
    }

    logger.info(`Circuit breaker state transition: ${this.config.name}`, {
      from: oldState,
      to: newState,
    });

    metrics.increment(`circuit.${this.config.name}.transition`, {
      from: oldState,
      to: newState,
    });
  }

  getStats(): CircuitStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailure: this.lastFailureTime ? new Date(this.lastFailureTime) : null,
      lastSuccess: this.lastSuccessTime ? new Date(this.lastSuccessTime) : null,
      totalCalls: this.totalCalls,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses,
    };
  }

  isOpen(): boolean {
    return this.state === "OPEN";
  }

  isClosed(): boolean {
    return this.state === "CLOSED";
  }

  // Manual circuit control (for testing or emergency)
  forceOpen() {
    this.lastFailureTime = Date.now();
    this.transitionTo("OPEN");
  }

  forceClose() {
    this.transitionTo("CLOSED");
  }

  reset() {
    this.failures = 0;
    this.successes = 0;
    this.transitionTo("CLOSED");
  }
}

// Custom error classes
export class CircuitOpenError extends Error {
  constructor(circuitName: string) {
    super(`Circuit breaker '${circuitName}' is OPEN - service unavailable`);
    this.name = "CircuitOpenError";
  }
}

export class TimeoutError extends Error {
  constructor(circuitName: string, timeout: number) {
    super(`Circuit breaker '${circuitName}' timeout after ${timeout}ms`);
    this.name = "TimeoutError";
  }
}

// Pre-configured circuit breakers for common services
export const circuits = {
  database: new CircuitBreaker({
    name: "database",
    failureThreshold: 3,
    resetTimeout: 10000, // 10 seconds
    successThreshold: 2,
    timeout: 5000, // 5 seconds
  }),

  email: new CircuitBreaker({
    name: "email",
    failureThreshold: 5,
    resetTimeout: 60000, // 1 minute
    successThreshold: 2,
    timeout: 30000, // 30 seconds (email can be slow)
  }),

  externalApi: new CircuitBreaker({
    name: "external-api",
    failureThreshold: 5,
    resetTimeout: 30000, // 30 seconds
    successThreshold: 3,
    timeout: 10000, // 10 seconds
  }),
};

// Helper function for wrapping async operations
export async function withCircuitBreaker<T>(
  circuit: CircuitBreaker,
  fn: () => Promise<T>,
  fallback?: () => T
): Promise<T> {
  try {
    return await circuit.execute(fn);
  } catch (error) {
    if (error instanceof CircuitOpenError && fallback) {
      logger.warn("Using fallback due to open circuit", {
        circuit: circuit.getStats(),
      });
      return fallback();
    }
    throw error;
  }
}

// Retry with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = () => true,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );

      logger.debug(`Retry attempt ${attempt + 1}/${maxRetries}`, {
        error: lastError,
        delay,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Bulkhead pattern - limit concurrent executions
export class Bulkhead {
  private active = 0;
  private queue: Array<() => void> = [];

  constructor(
    private readonly name: string,
    private readonly maxConcurrent: number,
    private readonly maxQueue: number = 100
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.active >= this.maxConcurrent) {
      if (this.queue.length >= this.maxQueue) {
        metrics.increment(`bulkhead.${this.name}.rejected`);
        throw new Error(`Bulkhead '${this.name}' queue full`);
      }

      // Wait in queue
      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }

    this.active++;
    metrics.gauge(`bulkhead.${this.name}.active`, this.active);

    try {
      return await fn();
    } finally {
      this.active--;
      metrics.gauge(`bulkhead.${this.name}.active`, this.active);

      // Release next in queue
      const next = this.queue.shift();
      if (next) next();
    }
  }

  getStats() {
    return {
      active: this.active,
      queued: this.queue.length,
      maxConcurrent: this.maxConcurrent,
      maxQueue: this.maxQueue,
    };
  }
}

// Pre-configured bulkheads
export const bulkheads = {
  database: new Bulkhead("database", 20, 50),
  email: new Bulkhead("email", 5, 20),
};
