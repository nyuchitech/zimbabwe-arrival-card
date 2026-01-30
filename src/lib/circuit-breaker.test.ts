import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CircuitBreaker,
  CircuitOpenError,
  TimeoutError,
  withRetry,
  Bulkhead,
} from "./circuit-breaker";

describe("Circuit Breaker", () => {
  let circuit: CircuitBreaker;

  beforeEach(() => {
    circuit = new CircuitBreaker({
      name: "test",
      failureThreshold: 3,
      resetTimeout: 1000,
      successThreshold: 2,
      timeout: 100,
    });
  });

  describe("Normal Operation", () => {
    it("should execute successful operations", async () => {
      const result = await circuit.execute(() => Promise.resolve("success"));
      expect(result).toBe("success");
      expect(circuit.isClosed()).toBe(true);
    });

    it("should track statistics", async () => {
      await circuit.execute(() => Promise.resolve("success"));

      const stats = circuit.getStats();
      expect(stats.totalCalls).toBe(1);
      expect(stats.totalSuccesses).toBe(1);
      expect(stats.state).toBe("CLOSED");
    });
  });

  describe("Circuit Opening", () => {
    it("should open after failure threshold", async () => {
      const failingFn = () => Promise.reject(new Error("fail"));

      for (let i = 0; i < 3; i++) {
        await expect(circuit.execute(failingFn)).rejects.toThrow("fail");
      }

      expect(circuit.isOpen()).toBe(true);
    });

    it("should reject immediately when open", async () => {
      circuit.forceOpen();

      await expect(circuit.execute(() => Promise.resolve())).rejects.toThrow(
        CircuitOpenError
      );
    });
  });

  describe("Timeout Handling", () => {
    it("should timeout slow operations", async () => {
      const slowFn = () =>
        new Promise((resolve) => setTimeout(resolve, 200));

      await expect(circuit.execute(slowFn)).rejects.toThrow(TimeoutError);
    });
  });

  describe("Recovery", () => {
    it("should transition to half-open after reset timeout", async () => {
      circuit.forceOpen();

      // Wait for reset timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Next call should go through (half-open)
      const result = await circuit.execute(() => Promise.resolve("recovered"));
      expect(result).toBe("recovered");
    });

    it("should close after successful calls in half-open", async () => {
      const circuitFast = new CircuitBreaker({
        name: "test-fast",
        failureThreshold: 1,
        resetTimeout: 50,
        successThreshold: 2,
        timeout: 1000,
      });

      // Open the circuit
      await expect(
        circuitFast.execute(() => Promise.reject(new Error("fail")))
      ).rejects.toThrow();

      // Wait for reset
      await new Promise((resolve) => setTimeout(resolve, 60));

      // Success calls to close
      await circuitFast.execute(() => Promise.resolve());
      await circuitFast.execute(() => Promise.resolve());

      expect(circuitFast.isClosed()).toBe(true);
    });
  });

  describe("Manual Control", () => {
    it("should force open", () => {
      circuit.forceOpen();
      expect(circuit.isOpen()).toBe(true);
    });

    it("should force close", () => {
      circuit.forceOpen();
      circuit.forceClose();
      expect(circuit.isClosed()).toBe(true);
    });

    it("should reset", async () => {
      await expect(
        circuit.execute(() => Promise.reject(new Error("fail")))
      ).rejects.toThrow();

      circuit.reset();

      const stats = circuit.getStats();
      expect(stats.failures).toBe(0);
      expect(stats.state).toBe("CLOSED");
    });
  });
});

describe("Retry with Exponential Backoff", () => {
  it("should succeed on first try", async () => {
    const fn = vi.fn().mockResolvedValue("success");

    const result = await withRetry(fn);

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce("success");

    const result = await withRetry(fn, { maxRetries: 2, baseDelay: 10 });

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should throw after max retries", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("always fails"));

    await expect(
      withRetry(fn, { maxRetries: 2, baseDelay: 10 })
    ).rejects.toThrow("always fails");

    expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it("should respect shouldRetry predicate", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("no retry"));

    await expect(
      withRetry(fn, {
        maxRetries: 3,
        baseDelay: 10,
        shouldRetry: () => false,
      })
    ).rejects.toThrow("no retry");

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("Bulkhead", () => {
  it("should limit concurrent executions", async () => {
    const bulkhead = new Bulkhead("test", 2, 5);
    let concurrent = 0;
    let maxConcurrent = 0;

    const fn = async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((resolve) => setTimeout(resolve, 50));
      concurrent--;
    };

    await Promise.all([
      bulkhead.execute(fn),
      bulkhead.execute(fn),
      bulkhead.execute(fn),
      bulkhead.execute(fn),
    ]);

    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });

  it("should reject when queue is full", async () => {
    const bulkhead = new Bulkhead("test", 1, 1);

    const longFn = () => new Promise((resolve) => setTimeout(resolve, 1000));

    // Start one execution
    const p1 = bulkhead.execute(longFn);
    // Queue one more
    const p2 = bulkhead.execute(longFn);

    // This should fail - queue full
    await expect(bulkhead.execute(longFn)).rejects.toThrow("queue full");

    // Clean up
    await Promise.allSettled([p1, p2]);
  });

  it("should track stats", () => {
    const bulkhead = new Bulkhead("test", 5, 10);
    const stats = bulkhead.getStats();

    expect(stats.maxConcurrent).toBe(5);
    expect(stats.maxQueue).toBe(10);
    expect(stats.active).toBe(0);
    expect(stats.queued).toBe(0);
  });
});
