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
