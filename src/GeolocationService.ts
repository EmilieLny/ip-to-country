import { IGeolocationCache } from "./IGeolocationCache";
import { IGeolocationProviderSelector } from "./IGeolocationProviderSelector";

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
