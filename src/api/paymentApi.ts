import api from "./axiosClient";

const BASE_URL = "/api/payment";

export async function payOrder(orderId: number, userId: number, paymentAmount: number) {
  const response = await api.post(`${BASE_URL}/create`, {
    orderId,
    userId,
    paymentAmount
  });
  return response.data;
}
