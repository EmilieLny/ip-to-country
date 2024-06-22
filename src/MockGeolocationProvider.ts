import { IGeolocationProvider } from "./IGeolocationProvider";

export class MockGeolocationProvider implements IGeolocationProvider {
  async getCountry(ip: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "IL";
  }
  isAvailable(): boolean {
    return Math.random() > 0.5;
  }
}
