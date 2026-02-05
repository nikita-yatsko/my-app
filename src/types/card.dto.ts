export interface Card {
  id: number;
  number: string;
  holder: string;
  expirationDate: string;
  active: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CardPage {
  content: Card[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface GetCardsParams {
  holder?: string;
  firstName?: string;
  surname?: string;
}
