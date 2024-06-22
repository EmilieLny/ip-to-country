import { IGeolocationProviderSelector } from "./IGeolocationProviderSelector";
import { IGeolocationProvider } from "./IGeolocationProvider";

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
