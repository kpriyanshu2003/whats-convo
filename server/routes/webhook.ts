import express, { Request, Response } from "express";
import dotnev from "dotenv";
import { WhatsappWebHook } from "../@types/message";
import MessageModel from "../models/message";

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
// 1. Handle messages send by user
// 2. Handle utility messages
router.post("/", async (req: Request, res: Response) => {
  let body: WhatsappWebHook = req.body;
  console.log(JSON.stringify(body, null, 2));

  // Handle messages send by user
  if (
    body.object &&
    body.entry[0].id &&
    body.entry[0].changes[0] &&
    body.entry[0].changes[0].value &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.contacts &&
    !body.entry[0].changes[0].value.statuses
  ) {
    const message = new MessageModel({
      senderName: body.entry[0].changes[0].value.contacts[0].profile.name,
      senderNo: body.entry[0].changes[0].value.contacts[0].wa_id,
      wa_id: body.entry[0].changes[0].value.messages[0].id,
      timestamp: body.entry[0].changes[0].value.messages[0].timestamp,
      type: body.entry[0].changes[0].value.messages[0].type,
      text: body.entry[0].changes[0].value.messages[0].text?.body,
      document: {
        filename: body.entry[0].changes[0].value.messages[0].document?.filename,
        mime_type:
          body.entry[0].changes[0].value.messages[0].document?.mime_type,
        sha256: body.entry[0].changes[0].value.messages[0].document?.sha256,
        id: body.entry[0].changes[0].value.messages[0].document?.id,
        caption: body.entry[0].changes[0].value.messages[0].document?.caption,
      },
      image: {
        caption: body.entry[0].changes[0].value.messages[0].image?.caption,
        mime_type: body.entry[0].changes[0].value.messages[0].image?.mime_type,
        sha256: body.entry[0].changes[0].value.messages[0].image?.sha256,
        id: body.entry[0].changes[0].value.messages[0].image?.id,
      },
      video: {
        mime_type: body.entry[0].changes[0].value.messages[0].video?.mime_type,
        sha256: body.entry[0].changes[0].value.messages[0].video?.sha256,
        id: body.entry[0].changes[0].value.messages[0].video?.id,
        caption: body.entry[0].changes[0].value.messages[0].video?.caption,
      },
      audio: {
        mime_type: body.entry[0].changes[0].value.messages[0].audio?.mime_type,
        sha256: body.entry[0].changes[0].value.messages[0].audio?.sha256,
        id: body.entry[0].changes[0].value.messages[0].audio?.id,
        voice: body.entry[0].changes[0].value.messages[0].audio?.voice,
      },
      errorMsg: {
        code: body.entry[0].changes[0].value.messages[0].errors?.[0].code,
        title: body.entry[0].changes[0].value.messages[0].errors?.[0].title,
        message: body.entry[0].changes[0].value.messages[0].errors?.[0].message,
        error_data:
          body.entry[0].changes[0].value.messages[0].errors?.[0].error_data
            .details,
      },
    });
    const savedMessage = await message.save();
    return res.status(200).send(savedMessage);
  }
  // Handle utility messages
  else if (
    body.object &&
    body.entry[0].id &&
    body.entry[0].changes[0] &&
    body.entry[0].changes[0].value &&
    body.entry[0].changes[0].value.statuses
  ) {
    const message = await MessageModel.findOneAndUpdate(
      {
        wa_id: body.entry[0].changes[0].value.statuses[0].id,
      },
      {
        timestamp: body.entry[0].changes[0].value.statuses[0].timestamp,
        status: body.entry[0].changes[0].value.statuses[0].status,
        statuses: {
          id: body.entry[0].changes[0].value.statuses[0].id,
          status: body.entry[0].changes[0].value.statuses[0].status,
          recipient_id: body.entry[0].changes[0].value.statuses[0].recipient_id,
        },
      }
    );
    console.log(message);
    return res.status(200).send(message);
    // const message = new MessageModel({
    //   statuses: {
    //     id: body.entry[0].changes[0].value.statuses[0].id,
    //     status: body.entry[0].changes[0].value.statuses[0].status,
    //     recipient_id: body.entry[0].changes[0].value.statuses[0].recipient_id,
    //   },
    // });
  } else res.sendStatus(200);
});

export default router;
