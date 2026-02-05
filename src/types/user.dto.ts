export interface User {
  userId: number;
  name: string;
  surname: string;
  birthDate: string;
  email: string;
  active: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface UserPage {
  content: User[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  firstName?: string;
  surname?: string;
}
