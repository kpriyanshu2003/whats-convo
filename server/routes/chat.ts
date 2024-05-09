import axios from "axios";
import express, { Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import fs from "fs";

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
    // const response = await axios(
    //   `https://graph.facebook.com/{{VERSION}}/{{PHONE_ID}}/messages`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer {{TOKEN}}`,
    //     },
    //     data: {
    //       messaging_product: "whatsapp",
    //       to: phone,
    //       text: { body: message },
    //     },
    //   }
    // );

    res.send({
      success: true,
      data: phone,
      message,
      file,
      fileUrl: "http://localhost:3300/" + file?.path,
      filePath: file?.path,
      // dat: response.data,
    });
    fs.unlinkSync("./" + file?.path);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
