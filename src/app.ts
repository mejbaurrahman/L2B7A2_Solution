import express from "express";
import cors from "cors";
import { authRoute } from "./modules/auth/auth.route";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
