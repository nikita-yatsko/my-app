import api from "./axiosClient";
import { OrderItemRequest, CreateOrderRequest } from "../types/order.dto";

const BASE_URL = "/api/order";

export async function createOrder(data: CreateOrderRequest) {
  const response = await api.post(`${BASE_URL}/create`, data);
  return response.data;
}

export async function getOrdersByUserId(userId: number) {
  const response = await api.get(`${BASE_URL}/user/${userId}`);
  return response.data;
}

export async function getAllOrders(params: {
  from?: string;
  to?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const response = await api.get(`${BASE_URL}/all`, { params });
  return response.data;
}

export async function getOrderById(orderId: number) { 
  const response = await api.get(`${BASE_URL}/${orderId}`); 
  return response.data;
}

export async function updateOrder(orderId: number, orderRequest: any) { 
  const response = await api.post(`${BASE_URL}/update/${orderId}`, orderRequest); 
  return response.data;
}