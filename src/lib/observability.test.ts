import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  logger,
  metrics,
  generateRequestId,
  createTimer,
  captureException,
} from "./observability";

describe("Observability Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Logger", () => {
    it("should log info messages with structured format", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

      logger.info("Test message", { requestId: "test-123" });

      expect(consoleSpy).toHaveBeenCalled();
      const logOutput = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(logOutput);

      expect(parsed.level).toBe("info");
      expect(parsed.message).toBe("Test message");
      expect(parsed.requestId).toBe("test-123");
      expect(parsed.timestamp).toBeDefined();
    });

    it("should log errors with sanitized stack traces", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Test error");

      logger.error("Error occurred", { error });

      expect(consoleSpy).toHaveBeenCalled();
      const logOutput = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(logOutput);

      expect(parsed.level).toBe("error");
      expect(parsed.error.name).toBe("Error");
      expect(parsed.error.message).toBe("Test error");
    });

    it("should log security events with severity", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      logger.logSecurityEvent("Suspicious activity detected", {
        severity: "high",
        userId: "user-123",
      });

      expect(consoleSpy).toHaveBeenCalled();
      const logOutput = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(logOutput);

      expect(parsed.message).toContain("SECURITY");
      expect(parsed.securityEvent).toBe(true);
    });
  });

  describe("Metrics", () => {
    it("should increment counters", () => {
      metrics.increment("test.counter");
      const allMetrics = metrics.getMetrics();

      expect(allMetrics.some((m) => m.name === "test.counter")).toBe(true);
    });

    it("should record gauges", () => {
      metrics.gauge("test.gauge", 42);
      const allMetrics = metrics.getMetrics();

      const gauge = allMetrics.find((m) => m.name === "test.gauge");
      expect(gauge?.value).toBe(42);
    });

    it("should record timing", () => {
      metrics.timing("test.timing", 150);
      const allMetrics = metrics.getMetrics();

      expect(allMetrics.some((m) => m.name === "test.timing.timing")).toBe(true);
    });
  });

  describe("Request ID Generator", () => {
    it("should generate unique request IDs", () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();

      expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("Timer", () => {
    it("should measure elapsed time", async () => {
      const timer = createTimer();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const elapsed = timer.elapsed();
      expect(elapsed).toBeGreaterThanOrEqual(45);
      expect(elapsed).toBeLessThan(200);
    });
  });

  describe("Exception Capture", () => {
    it("should log captured exceptions", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Test exception");

      captureException(error, { context: "test" });

      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
