import { CacheManager } from "../src/patterns/singleton/CacheManager";

describe("CacheManager Singleton", () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = CacheManager.getInstance();
    cache.clear();
  });

  it("should return same instance", () => {
    const instance1 = CacheManager.getInstance();
    const instance2 = CacheManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should set and get values", () => {
    cache.set("user:1", { name: "John" });
    expect(cache.get("user:1")).toEqual({ name: "John" });
  });

  it("should return null for missing keys", () => {
    expect(cache.get("nonexistent")).toBeNull();
  });

  it("should delete entries", () => {
    cache.set("key", "value");
    cache.delete("key");
    expect(cache.get("key")).toBeNull();
  });

  it("should report correct size", () => {
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.size()).toBe(3);
  });

  it("should check if key exists", () => {
    cache.set("exists", true);
    expect(cache.has("exists")).toBe(true);
    expect(cache.has("nope")).toBe(false);
  });

  it("should clear all entries", () => {
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    expect(cache.size()).toBe(0);
  });
});
