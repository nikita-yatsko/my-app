import api from "./axiosClient";
import { Card } from "../types/card.dto";

const BASE_URL = "/api/card";

export async function getCardsByUserId(userId: number): Promise<Card[]> {
  const response = await api.get<Card[]>(`${BASE_URL}/user/${userId}`);
  return response.data;
}

export async function deleteCard(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}/delete`);
}

export async function activateCard(id: number): Promise<void> {
  await api.put(`${BASE_URL}/${id}/active`);
}

export async function deactivateCard(id: number): Promise<void> {
  await api.put(`${BASE_URL}/${id}/inactive`);
}

export async function createCard(id: number): Promise<void> {
  await api.post(`${BASE_URL}/create/${id}`);
}
