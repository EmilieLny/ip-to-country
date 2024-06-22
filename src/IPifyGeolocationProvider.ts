import { HourlyRateLimiter } from "./HourlyRateLimiter";
import { IGeolocationProvider } from "./IGeolocationProvider";

export class IPifyGeolocationProvider implements IGeolocationProvider {
  private rateLimiter = new HourlyRateLimiter(20);
  constructor(private apiKey: string) {}

  async getCountry(ip: string): Promise<string> {
    this.rateLimiter.increaseCounter();
    const result = await fetch(
      `https://geo.ipify.org/api/v2/country?apiKey=${this.apiKey}&ipAddress=${ip}`
    );
    const data = await result.json();
    if ("code" in data) {
      throw new Error(data.messages || "Unexpected error");
    }
    return data.location.country;
  }
  isAvailable(): boolean {
    return !this.rateLimiter.isRateLimited;
  }
}
