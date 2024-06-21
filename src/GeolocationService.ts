export class GeolocationService {
  constructor(
    private cache: IGeolocationCache,
    private providerSelector: IGeolocationProviderSelector
  ) {}

  public async getCountry(ip: string): Promise<string> {
    const cachedCountry = await this.cache.getCountry(ip);
    if (cachedCountry) return cachedCountry;

    const provider = this.providerSelector.getAvailableProvider();
    const country = await provider.getCountry(ip);

    await this.cache.setCountry(ip, country);

    return country;
  }
}

interface IGeolocationCache {
  getCountry(ip: string): Promise<string | null>;
  setCountry(ip: string, country: string): Promise<void>;
}

export class InMemoryGeolocationCache implements IGeolocationCache {
  private cache: Record<string, string> = {};

  async getCountry(ip: string): Promise<string | null> {
    return this.cache[ip];
  }

  async setCountry(ip: string, country: string): Promise<void> {
    this.cache[ip] = country;
  }
}

interface IGeolocationProvider {
  getCountry(ip: string): Promise<string>;
  isAvailable(): boolean;
}

export class MockGeolocationProvider implements IGeolocationProvider {
  async getCountry(ip: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "ISRAEL";
  }
  isAvailable(): boolean {
    return true;
  }
}

interface IGeolocationProviderSelector {
  getAvailableProvider(): IGeolocationProvider;
}

export class FirstAvailableProviderSelector
  implements IGeolocationProviderSelector
{
  constructor(private providers: IGeolocationProvider[]) {}

  getAvailableProvider(): IGeolocationProvider {
    const provider = this.providers.find((p) => p.isAvailable());
    if (provider) return provider;
    throw new Error("No Geolocation Provider Available");
  }
}

class HourlyRateLimiter {
  private counter: number = 0;
  private timestamp: Date | null = null;
  constructor(private maxCounter: number) {}

  private get isExpired(): boolean {
    const hourInMilliseconds = 60 * 60 * 1000;
    return (
      !this.timestamp ||
      Date.now() - this.timestamp.getTime() > hourInMilliseconds
    );
  }

  increaseCounter(): void {
    this.counter++;
    if (this.isExpired) {
      this.timestamp = new Date();
    }
  }

  get isRateLimited(): boolean {
    if (!this.timestamp) return false;
    if (Date.now() - this.timestamp.getTime() > 60 * 60 * 1000) {
      return false;
    }
    return this.counter >= this.maxCounter;
  }
}

export class IPStackGeolocationProvider implements IGeolocationProvider {
  private rateLimiter = new HourlyRateLimiter(80); // 50,000/month

  async getCountry(ip: string): Promise<string> {
    this.rateLimiter.increaseCounter();
    const result = await fetch(
      `https://api.ipstack.com/${ip}?access_key=YOUR_ACCESS_KEY`
    );
    const data = await result.json();
    return data.country_name;
  }
  isAvailable(): boolean {
    return !this.rateLimiter.isRateLimited;
  }
}
