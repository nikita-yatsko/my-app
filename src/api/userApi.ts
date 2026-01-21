import api from "./axiosClient";
import { User, UserPage, GetUsersParams } from "../types/user.dto";

const BASE_URL = "/api/user";

export async function getUsers(params: GetUsersParams = {}): Promise<UserPage> {
  const {
    page = 0,          // по умолчанию первая страница
    size = 10,         // по умолчанию 10 записей на странице
    firstName,
    surname,
  } = params;

  try {
    const response = await api.get<UserPage>(`${BASE_URL}/all`, {
      params: {
        page,
        size,
        ...(firstName && { firstName }),   // добавляем только если указано
        ...(surname && { surname }),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    throw error; // или можно обработать ошибку по-другому
  }
}

export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`${BASE_URL}/${id}`);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}

export async function activateUser(id: number): Promise<void> {
  await api.put(`${BASE_URL}/${id}/active`);
}

export async function deactivateUser(id: number): Promise<void> {
  await api.put(`${BASE_URL}/${id}/inactive`);
}