import express, { Request, Response } from "express";
const router = express.Router();
import axios from "axios";

const myToken = "admin0";
const tokenn =
  "EAAGCIy4szIYBO0EiPNpIyE0cQfAWiKIWmQubL4eVGPVEyxD8FD6ZCZCmekouQ4Fzw7EkfJND93FZBoxOg9GZBEZA1ZApxpsKbQWqi7sugvwkgT3rRUQJ00ryVjzQUaJMxdQZBZC9O6skIK8763Ap2vG4qPAR4XXLeiPfEF3hOZCQLZA0j2l9SZArpw24zmZACQaZCdlBL2NIutyB6IH82vdVD0Rxu6iqXClnOoGtCxvgZD";

// To verify the callback url from Facebook
router.get("/", (req: Request, res: Response) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === myToken)
      res.status(200).send(challenge);
    else res.sendStatus(403);
  } else res.sendStatus(403);
});

router.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  let body = req.body;
  JSON.stringify(body, null, 2);
  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      let phNoId = body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body.entry[0].changes[0].value.messages[0].from;
      let message = body.entry[0].changes[0].value.messages[0].text.body;

      axios({
        method: "post",
        url: `https://graph.facebook.com/v19.0/${phNoId}/messages?access_token=${tokenn}`,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi... I'm Priyanshu",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      res.sendStatus(200);
    } else res.sendStatus(404);
  } else res.sendStatus(404);
});

export default router;
