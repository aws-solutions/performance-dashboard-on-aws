import express from "express";
import cors from "cors";

import dashboard from "./dashboard-api";
import topicarea from "./topicarea-api";
import dataset from "./dataset-api";
import homepage from "./homepage-api";
import publicapi from "./public-api";

const app = express();
app.use(express.json());
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; block-all-mixed-content;"
  );
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31540000; includeSubdomains"
  );
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use("/dashboard", dashboard);
app.use("/topicarea", topicarea);
app.use("/dataset", dataset);
app.use("/homepage", homepage);
app.use("/public", publicapi);

export default app;
