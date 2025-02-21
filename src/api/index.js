import express from "express";
import routes from "./routes.js";
import cors from "cors";
import keys from "../constants/keys.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(keys.Port, () => {
  console.log(`Server is running on http://localhost:${keys.Port}`);
});
