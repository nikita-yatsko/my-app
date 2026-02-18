import api from "./axiosClient";
import { Item } from "../types/item.dto";

const BASE_URL = "/api/item";

export async function getAllItems(): Promise<Item[]> {
  const response = await api.get<Item[]>(`${BASE_URL}/all`);
  return response.data;
}

export async function deleteItem(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/delete/${id}`);
}

export async function createItem(data: { name: string; price: number }): Promise<Item> {
  const response = await api.post<Item>(`${BASE_URL}/add`, data);
  return response.data;
}