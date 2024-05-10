import axios from "axios";
import express, { Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import dotenv from "dotenv";
import { WhatsAppRequest } from "../@types/request";
import MessageModel from "../models/message";

dotenv.config();
const TOKEN = process.env.WATOKEN || "";
const PHONE_ID = process.env.PHONE_ID || "";
const VERSION = process.env.VERSION || "";
const URL = process.env.URL || "";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage });
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { phone, message } = req.body;
    const file = req.file;

    let fileType:
      | "document"
      | "image"
      | "application"
      | "audio"
      | "video"
      | string
      | undefined = file?.mimetype.split("/")[0];
    if (fileType === "application") fileType = "document";
    const fileUrl = URL + "/" + file?.path;

    let requestBody: WhatsAppRequest = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: fileType || "text",
    };
    let responseBody = {
      senderNo: phone,
      type: fileType || "text",
      text: fileType === "text" ? message : undefined,
      document: undefined,
      image: undefined,
      video: undefined,
      audio: undefined,
    };

    switch (fileType) {
      case "image":
      case "document":
      case "video":
        requestBody[fileType] = { caption: message, link: fileUrl };
        break;
      case "audio":
        requestBody.audio = { link: fileUrl };

        break;
      case "text":
        requestBody.text = { body: message };
        break;
      default:
        requestBody.text = { body: message };
    }
    const response = await axios(
      `https://graph.facebook.com/${VERSION}/${PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        data: requestBody,
      }
    );

    const messageDB = new MessageModel({
      wa_id: response.data.messages?.[0].id,
      senderNo: phone,
      type: fileType || "text",
      text: fileType === "text" ? message : undefined,
      document:
        fileType === "document"
          ? {
              caption: message,
              filename: file?.filename,
              mime_type: file?.mimetype,
            }
          : undefined,
      image:
        fileType === "image"
          ? {
              caption: message,
              filename: file?.filename,
              mime_type: file?.mimetype,
            }
          : undefined,
      video:
        fileType === "video"
          ? {
              caption: message,
              filename: file?.filename,
              mime_type: file?.mimetype,
            }
          : undefined,
      audio:
        fileType === "audio"
          ? {
              filename: file?.filename,
              mime_type: file?.mimetype,
            }
          : undefined,
    });

    const savedMessage = await messageDB.save();

    console.log({
      success: true,
      phone,
      message,
      file,
      requestBody,
      data: JSON.stringify(await response.data, null, 2),
      savedMessage,
    });
    res.send({
      success: true,
      phone,
      message,
      file,
      requestBody,
      data: await response.data,
      savedMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const message = await MessageModel.find();
    res.render("messages", { message });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
