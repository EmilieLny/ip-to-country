import { HourlyRateLimiter } from "../HourlyRateLimiter";

describe("HourlyRateLimiter", () => {
  let limiter: HourlyRateLimiter;
  const maxCounter = 5;

  beforeEach(() => {
    limiter = new HourlyRateLimiter(maxCounter);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("increaseCounter", () => {
    it("should not be rate limited after increasing counter below max limit within an hour", () => {
      for (let i = 0; i < maxCounter - 1; i++) {
        limiter.increaseCounter();
      }
      const result = limiter.isRateLimited;
      expect(result).toBe(false);
    });

    it("should be rate limited after increasing counter to max limit within an hour", () => {
      for (let i = 0; i < maxCounter; i++) {
        limiter.increaseCounter();
      }
      const result = limiter.isRateLimited;
      expect(result).toBe(true);
    });

    it("should reset and not be rate limited after an hour has passed", () => {
      for (let i = 0; i < maxCounter; i++) {
        limiter.increaseCounter();
      }
      jest.advanceTimersByTime(60 * 60 * 1000 + 1); // Advance time by just over an hour
      const result = limiter.isRateLimited;
      expect(result).toBe(false);
    });

    it("should not be rate limited if counter is increased after an hour has passed", () => {
      for (let i = 0; i < maxCounter; i++) {
        limiter.increaseCounter();
      }
      jest.advanceTimersByTime(60 * 60 * 1000 + 1); // Advance time by just over an hour
      limiter.increaseCounter(); // This should reset the limiter
      const result = limiter.isRateLimited;
      expect(result).toBe(false);
    });
  });

  describe("isRateLimited", () => {
    it("should return false if no counter increase has happened", () => {
      const result = limiter.isRateLimited;
      expect(result).toBe(false);
    });

    it("should return false if counter is below max limit within an hour", () => {
      for (let i = 0; i < maxCounter - 1; i++) {
        limiter.increaseCounter();
      }
      const result = limiter.isRateLimited;
      expect(result).toBe(false);
    });

    it("should return true if counter reaches max limit within an hour", () => {
      for (let i = 0; i < maxCounter; i++) {
        limiter.increaseCounter();
      }
      const result = limiter.isRateLimited;
      expect(result).toBe(true);
    });

    it("should return false if an hour has passed since max limit was reached", () => {
      for (let i = 0; i < maxCounter; i++) {
        limiter.increaseCounter();
      }
      jest.advanceTimersByTime(60 * 60 * 1000 + 1); // Advance time by just over an hour
      const result = limiter.isRateLimited;
      expect(result).toBe(false);
    });
  });
});
