import { InMemoryGeolocationCache } from "../GeolocationService";

describe("InMemoryGeolocationCache", () => {
  let cache: InMemoryGeolocationCache;

  beforeEach(() => {
    cache = new InMemoryGeolocationCache();
  });

  describe("getCountry", () => {
    it("should return null if the IP address is not in the cache", async () => {
      const result = await cache.getCountry("192.168.0.1");
      expect(result).toBeFalsy();
    });

    it("should return the country if the IP address is in the cache", async () => {
      await cache.setCountry("192.168.0.1", "US");
      const result = await cache.getCountry("192.168.0.1");
      expect(result).toBe("US");
    });
  });

  describe("setCountry", () => {
    it("should set the country for the given IP address", async () => {
      await cache.setCountry("192.168.0.1", "US");
      const result = await cache.getCountry("192.168.0.1");
      expect(result).toBe("US");
    });

    it("should overwrite the country for the given IP address if it already exists", async () => {
      await cache.setCountry("192.168.0.1", "US");
      await cache.setCountry("192.168.0.1", "CA");
      const result = await cache.getCountry("192.168.0.1");
      expect(result).toBe("CA");
    });
  });
});
