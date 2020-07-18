import express from "express";
import cors from "cors";

import dashboard from "./dashboard";
import topicarea from "./topicarea";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/dashboard", dashboard);
app.use("/topicarea", topicarea);

export default app;
