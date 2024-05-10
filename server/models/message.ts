import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderName: { type: String, default: "" },
    senderNo: { type: String, default: "" },
    wa_id: { type: String, default: "" },
    timestamp: { type: String, default: "" },
    type: { type: String, default: "" }, // ['image', 'text', 'document', 'audio', 'video', 'unsupported', 'utility']
    text: { type: String },
    status: { type: String },
    document: {
      caption: { type: String },
      filename: { type: String },
      mime_type: { type: String },
      sha256: { type: String },
      id: { type: String },
    },
    image: {
      caption: { type: String },
      mime_type: { type: String },
      sha256: { type: String },
      id: { type: String },
    },
    video: {
      caption: { type: String },
      mime_type: { type: String },
      sha256: { type: String },
      id: { type: String },
    },
    audio: {
      mime_type: { type: String },
      sha256: { type: String },
      id: { type: String },
      voice: { type: Boolean },
    },
    errorMsg: {
      code: { type: Number },
      title: { type: String },
      message: { type: String },
      error_data: { type: String },
    },
    statuses: {
      id: { type: String }, // Conversation ID
      status: { type: String },
      recipient_id: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
