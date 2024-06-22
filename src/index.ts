import express from "express";
import { service } from "./Container";
import { errorHandler } from "./ErrorHandlerMiddleware";

const app = express();
const port = 3000;

app.get("/geolocation", async (req, res, next) => {
  try {
    const country = await service.getCountry(req.query.ip as string);
    res.json(country);
  } catch (e) {
    next(e);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
