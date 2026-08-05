import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import * as redisService from "./services/redis.service";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use("/api", routes);

app.get("/health", (_req, res) => res.json({ status: "OK" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  // Init Redis (non-blocking). If it fails, server should continue running.
  redisService.connect().catch((err) => console.error("Redis init failed", err));
});

process.on("SIGINT", async () => {
  await redisService.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await redisService.disconnect();
  process.exit(0);
});

export default app;

