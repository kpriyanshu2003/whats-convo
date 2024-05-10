export interface WhatsappResponse {
  messaging_product: string;
  contacts?: Contact[];
  messages?: Message[];
  error?: ErrorDetails;
}

interface Contact {
  input: string;
  wa_id: string;
}

interface Message {
  id: string;
}

interface ErrorDetails {
  message: string;
  type: string;
  code: number;
  error_data: ErrorData;
  fbtrace_id: string;
}

interface ErrorData {
  messaging_product: string;
  details: string;
}
