import api from "./axiosClient";
import { PaymentDto } from "../types/payment.dto";

const BASE_URL = "/api/payment";

export async function payOrder(orderId: number, userId: number, paymentAmount: number) {
  const response = await api.post(`${BASE_URL}/create`, {
    orderId,
    userId,
    paymentAmount
  });
  return response.data;
}

export async function getPaymentsByAny(
  userId?: string,
  orderId?: string,
  status?: string
): Promise<PaymentDto[]> {
  const params = new URLSearchParams();

  if (userId && userId.trim() !== "") params.append("userId", userId);
  if (orderId && orderId.trim() !== "") params.append("orderId", orderId);
  if (status && status.trim() !== "") params.append("status", status);

  const query = params.toString();
  const url = query ? `${BASE_URL}/byAny?${query}` : `${BASE_URL}/byAny`;

  const response = await api.get(url);
  return response.data;
}

export async function getTotalPaymentsByUser(
  userId: string,
  from: string,
  to: string
): Promise<number> {
  const params = new URLSearchParams({
    userId,
    from,
    to
  });

  const response = await api.get(`${BASE_URL}/summary?${params.toString()}`);
  return response.data;
}

export async function getTotalPaymentsAll(
  from: string,
  to: string
): Promise<number> {
  const params = new URLSearchParams({ from, to });

  const response = await api.get(`${BASE_URL}/summary/all?${params.toString()}`);
  return response.data;
}
