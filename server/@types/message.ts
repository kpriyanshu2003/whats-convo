export interface WhatsappWebHook {
  object: string; // whatsapp_business_account
  entry: [
    {
      id: string; // 311844092013153
      changes: [
        {
          value: {
            messaging_product: string; // whatsapp
            metadata: {
              display_phone_number: string; // 15556114413
              phone_number_id: string; // 296960866837443
            };
            contacts?: [
              {
                profile: {
                  name: string; // Jiska WA Account hai
                };
                wa_id: string; // Phone number
              }
            ];
            messages?: [
              {
                from: string; // Jis number se aaya hai
                id: string; // WhatsApp message ID
                timestamp: string; // UNIX timestamp
                type:
                  | "image"
                  | "text"
                  | "document"
                  | "audio"
                  | "video"
                  | "unsupported";
                text?: { body: string };
                document?: {
                  filename: string;
                  mime_type: string;
                  sha256: string;
                  id: string;
                };
                image?: {
                  caption: string;
                  mime_type: string;
                  sha256: string;
                  id: string;
                };
                video?: {
                  mime_type: string;
                  sha256: string;
                  id: string;
                };
                audio?: {
                  mime_type: string;
                  sha256: string;
                  id: string;
                  voice: boolean;
                };
                errors?: [
                  {
                    code: number;
                    title: string;
                    message: string;
                    error_data: {
                      details: string;
                    };
                  }
                ];
              }
            ];
            statuses?: [
              {
                id: string;
                status: string; // read
                timestamp: string;
                recipient_id: string; // jisko message bheja
                conversationn: {
                  id: string;
                  origin: {
                    type: string; // utility
                  };
                };
                pricing: {
                  billable: boolean; // true
                  pricing_model: string; // CBP
                  category: string; // utility
                };
              }
            ];
          };
          field: string; // messages
        }
      ];
    }
  ];
}
