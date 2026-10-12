import express from "express";
import { router } from "./routes.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", router);

  app.use("/api", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err.stack || err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
