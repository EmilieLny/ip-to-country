import { IGeolocationProvider } from "./IGeolocationProvider";

export interface IGeolocationProviderSelector {
  getAvailableProvider(): IGeolocationProvider;
}
