import api from "./axiosClient";
import { OrderItemRequest, CreateOrderRequest } from "../types/order.dto";

const BASE_URL = "/api/order";

export async function createOrder(data: CreateOrderRequest) {
  const response = await api.post(`${BASE_URL}/create`, data);
  return response.data;
}
