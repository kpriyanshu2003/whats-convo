export interface WhatsAppMediaMessage {
  object: string;
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts: {
          profile: {
            name: string;
          };
          wa_id: string;
        }[];
        messages: {
          from: string;
          id: string;
          timestamp: string;
          type: "image";
          image: {
            caption: string;
            mime_type: string;
            sha256: string;
            id: string;
          };
        }[];
      };
      field: string;
    }[];
  }[];
}
