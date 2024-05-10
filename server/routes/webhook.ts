import express, { Request, Response } from "express";
import dotnev from "dotenv";

const router = express.Router();
dotnev.config();
const CSTOKEN = process.env.CSTOKEN || "";
const WATOKEN = process.env.WATOKEN || "";

// To verify the callback url
router.get("/", (req: Request, res: Response) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === CSTOKEN)
      res.status(200).send(challenge);
    else res.sendStatus(403);
  } else res.sendStatus(403);
});

// To handle callback events
router.post("/", (req: Request, res: Response) => {
  let body = req.body;
  console.log(JSON.stringify(body, null, 2));

  res.sendStatus(200);
});

export default router;
