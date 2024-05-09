import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import compress from "compression";

dotenv.config();
const port = process.env.PORT || 3300;
const app = express();
const mongodb = process.env.MONGODB_URI || "mongodb://localhost:27017/express";

import webhookRouter from "./routes/webhook";
import chatRouter from "./routes/chat";

const corsConfig = {
  origin: ["http://localhost:3000", "http://localhost:5500"],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(compress());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
