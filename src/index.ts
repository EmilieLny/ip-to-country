import express from "express";
import { service } from "./Container";

const app = express();
const port = 3000;

app.get("/geolocation", async (req, res) => {
  const country = await service.getCountry(req.query.ip as string);
  res.json(country);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
