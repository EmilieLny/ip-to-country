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
  getCountry: (ip: string) => Promise<string | null>;
  setCountry: (ip: string, country: string) => Promise<void>;
}

interface IGeolocationProvider {
  getCountry: (ip: string) => Promise<string>;
  isAvailable: () => boolean;
}

interface IGeolocationProviderSelector {
  getAvailableProvider: () => IGeolocationProvider;
}
