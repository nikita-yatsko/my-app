import axios from "axios";
import { LoginRequest, LoginResponse, ValidateResponse } from "../types/auth";

const BASE_URL = "/api/auth";

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, request);
  localStorage.setItem("token", response.data.accessToken);
  return response.data;
}

export async function register(data: {
  username: string;
  password: string;
  name: string;
  surname: string;
  birthDate: string;
  email: string;
}) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Registration failed");
  }
}

export async function validateToken(): Promise<ValidateResponse | null> {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const response = await axios.post<ValidateResponse>(
    `${BASE_URL}/validate`,
    { token }
  );

  return response.data.valid ? response.data : null;
}
