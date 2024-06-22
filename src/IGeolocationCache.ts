export interface IGeolocationCache {
  getCountry(ip: string): Promise<string | null>;
  setCountry(ip: string, country: string): Promise<void>;
}
