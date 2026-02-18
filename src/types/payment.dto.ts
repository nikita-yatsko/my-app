export interface PaymentDto {
  id: string;
  orderId: string;
  userId: string;
  status: "SUCCESS" | "FAILED";
  timestamp: string;
  paymentAmount: number;
}