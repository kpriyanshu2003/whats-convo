import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import compress from "compression";

dotenv.config();
const port = process.env.PORT || 3300;
const app = express();
const mongodb = process.env.MONGODB_URI || "mongodb://localhost:27017/express";

import webhookRouter from "./routes/webhook";
import chatRouter from "./routes/chat";

const corsConfig = {
  origin: [
    "http://localhost:3000",
    "https://kpriyanshu2003.github.io/whats-convo",
    "https://kpriyanshu2003.github.io",
  ],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(compress());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/webhook", webhookRouter);
app.use("/chat", chatRouter);

app.use((req: Request, res: Response) => {
  res.json({ message: "API Working Normally" });
});

mongoose
  .connect(mongodb)
  .then(() =>
    app.listen(port, () =>
      console.log("Server running on http://localhost:", port)
    )
  )
  .catch((error) => console.log(error));
