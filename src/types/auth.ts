export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ValidateResponse {
  valid: boolean;
  userId: number;
  role: "ADMIN" | "USER";
  username: string;
}