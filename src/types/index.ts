export interface CardRequest {
  cardCategory: 'HYBRID' | 'AR_QR';
  cardSerial: string;
  email: string;
  name: string;
  phone: string;
  timestamp: string;
}