import { IGeolocationCache } from "./IGeolocationCache";

export class InMemoryGeolocationCache implements IGeolocationCache {
  private cache: Record<string, string> = {};

  async getCountry(ip: string): Promise<string | null> {
    return this.cache[ip];
  }

  async setCountry(ip: string, country: string): Promise<void> {
    this.cache[ip] = country;
  }
}
