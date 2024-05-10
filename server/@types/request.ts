export interface WhatsAppRequest {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  image?: {
    caption: string;
    link: string;
  };
  text?: {
    body: string;
  };
  audio?: {
    link: string;
  };
  document?: {
    link: string;
    caption: string;
  };
  video?: {
    link: string;
    caption: string;
  };
}
