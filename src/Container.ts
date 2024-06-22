import { CountryIsGeolocationProvider } from "./CountryIsGeolocationProvider";
import { IPifyGeolocationProvider } from "./IPifyGeolocationProvider";
import { IPStackGeolocationProvider } from "./IPStackGeolocationProvider";
import { FirstAvailableProviderSelector } from "./FirstAvailableProviderSelector";
import { MockGeolocationProvider } from "./MockGeolocationProvider";
import { InMemoryGeolocationCache } from "./InMemoryGeolocationCache";
import { GeolocationService } from "./GeolocationService";
import "dotenv/config";

const mockProvider = new MockGeolocationProvider();
const ipStackProvider = new IPStackGeolocationProvider(
  process.env.IPSTACK_ACCESS_KEY!
);
const ipifyProvider = new IPifyGeolocationProvider(
  process.env.IPIFY_ACCESS_KEY!
);
const countryIsProvider = new CountryIsGeolocationProvider();
const selector = new FirstAvailableProviderSelector([
  countryIsProvider,
  ipifyProvider,
  ipStackProvider,
  mockProvider,
]);
const cache = new InMemoryGeolocationCache();
export const service = new GeolocationService(cache, selector);
