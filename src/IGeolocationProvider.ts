export interface IGeolocationProvider {
  getCountry(ip: string): Promise<string>;
  isAvailable(): boolean;
}
