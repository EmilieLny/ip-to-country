import { HourlyRateLimiter } from "./HourlyRateLimiter";
import { IGeolocationProvider } from "./IGeolocationProvider";

export class CountryIsGeolocationProvider implements IGeolocationProvider {
  private rateLimiter = new HourlyRateLimiter(2);

  async getCountry(ip: string): Promise<string> {
    this.rateLimiter.increaseCounter();
    const result = await fetch(`https://api.country.is/${ip}`);
    const data = await result.json();
    if ("error" in data) {
      throw new Error(data.error.message || "Unexpected error");
    }
    return data.country;
  }
  isAvailable(): boolean {
    return !this.rateLimiter.isRateLimited;
  }
}
