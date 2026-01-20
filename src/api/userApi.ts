import api from "./axiosClient";
import { User, UserPage } from "../types/user.dto";

const BASE_URL = "/api/user";

export async function getUsers(page: number, size: number): Promise<UserPage> {
  const response = await api.get<UserPage>(`${BASE_URL}/all?page=${page}&size=${size}`);
  return response.data;
}

export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`${BASE_URL}/${id}`);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}
