import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base", isActive && "active");
    expect(result).toBe("base active");
  });

  it("should filter out falsy values", () => {
    const result = cn("base", false, null, undefined, "valid");
    expect(result).toBe("base valid");
  });

  it("should merge Tailwind classes correctly", () => {
    // twMerge should resolve conflicting Tailwind classes
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle array of classes", () => {
    const result = cn(["foo", "bar"], "baz");
    expect(result).toBe("foo bar baz");
  });

  it("should handle object syntax", () => {
    const result = cn({
      base: true,
      active: true,
      disabled: false,
    });
    expect(result).toBe("base active");
  });

  it("should handle complex Tailwind merging", () => {
    const result = cn(
      "bg-red-500 text-white",
      "bg-blue-500",
      "hover:bg-green-500"
    );
    expect(result).toBe("text-white bg-blue-500 hover:bg-green-500");
  });

  it("should return empty string for no inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle mixed inputs", () => {
    const condition = true;
    const result = cn(
      "base-class",
      condition && "conditional",
      ["array", "classes"],
      { object: true, disabled: false }
    );
    expect(result).toBe("base-class conditional array classes object");
  });
});
