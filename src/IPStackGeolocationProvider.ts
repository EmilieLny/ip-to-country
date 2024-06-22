import { HourlyRateLimiter } from "./HourlyRateLimiter";
import { IGeolocationProvider } from "./IGeolocationProvider";

export class IPStackGeolocationProvider implements IGeolocationProvider {
  private rateLimiter = new HourlyRateLimiter(80);
  constructor(private accessKey: string) {}

  async getCountry(ip: string): Promise<string> {
    this.rateLimiter.increaseCounter();
    const result = await fetch(
      `http://api.ipstack.com/${ip}?access_key=${this.accessKey}`
    );
    const data = await result.json();
    if ("error" in data) {
      throw new Error(data.error.info || "Unexpected error");
    }
    return data.country_code;
  }
  isAvailable(): boolean {
    return !this.rateLimiter.isRateLimited;
  }
}
