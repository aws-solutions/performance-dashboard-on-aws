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

app.use("/dashboard", dashboard);
app.use("/topicarea", topicarea);
app.use("/dataset", dataset);
app.use("/homepage", homepage);
app.use("/public", publicapi);

export default app;
