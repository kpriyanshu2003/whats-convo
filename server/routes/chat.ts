import axios from "axios";
import express, { Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import { WhatsAppRequest } from "../@types/request";

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

    let fileType = file?.mimetype.split("/")[0];
    if (fileType === "application") fileType = "document";
    const fileUrl = URL + "/" + file?.path;

    let requestBody: WhatsAppRequest = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: fileType || "text",
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

    res.send({
      success: true,
      phone,
      message,
      file,
      requestBody,
      data: await response.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
