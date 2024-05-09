import express, { Request, Response } from "express";
import axios from "axios";
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
  // console.log(req.body);
  let body = req.body;
  console.log(JSON.stringify(body, null, 2));
  // if (body.object) {
  //   if (
  //     body.entry &&
  //     body.entry[0].changes &&
  //     body.entry[0].changes[0].value.messages &&
  //     body.entry[0].changes[0].value.messages[0]
  //   ) {
  //     let phNoId = body.entry[0].changes[0].value.metadata.phone_number_id;
  //     let from = body.entry[0].changes[0].value.messages[0].from;
  //     let message = body.entry[0].changes[0].value.messages[0].text.body;

  //     axios({
  //       method: "post",
  //       url: `https://graph.facebook.com/v19.0/${phNoId}/messages?access_token=${WATOKEN}`,
  //       data: {
  //         messaging_product: "whatsapp",
  //         to: from,
  //         text: {
  //           body: "Hi... I'm Priyanshu",
  //         },
  //       },
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     res.sendStatus(200);
  //   } else res.sendStatus(404);
  // } else res.sendStatus(404);
  res.sendStatus(200);
});

export default router;
