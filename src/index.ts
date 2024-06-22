import express from "express";
import {
  CountryIsGeolocationProvider,
  FirstAvailableProviderSelector,
  GeolocationService,
  IPStackGeolocationProvider,
  IPifyGeolocationProvider,
  InMemoryGeolocationCache,
  MockGeolocationProvider,
} from "./GeolocationService";
import "dotenv/config";

const app = express();
const port = 3000;

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
const service = new GeolocationService(cache, selector);

app.get("/geolocation", async (req, res) => {
  const country = await service.getCountry(req.query.ip as string);
  res.json(country);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
