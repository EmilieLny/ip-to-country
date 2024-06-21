import express from "express";
import {
  FirstAvailableProviderSelector,
  GeolocationService,
  IPStackGeolocationProvider,
  InMemoryGeolocationCache,
  MockGeolocationProvider,
} from "./GeolocationService";

const app = express();
const port = 3000;

const provider = new MockGeolocationProvider();
const ipStackProvider = new IPStackGeolocationProvider();
const selector = new FirstAvailableProviderSelector([
  provider,
  ipStackProvider,
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
