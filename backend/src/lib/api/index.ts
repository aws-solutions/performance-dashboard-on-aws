import express from "express";
import cors from "cors";

import dashboard from "./dashboard-api";
import topicarea from "./topicarea-api";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/dashboard", dashboard);
app.use("/topicarea", topicarea);

export default app;
