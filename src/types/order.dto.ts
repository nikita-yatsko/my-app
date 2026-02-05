export interface OrderItemRequest {
  item: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface CreateOrderRequest {
  userId: number;
  totalPrice: number;
  items: OrderItemRequest[];
}

export interface ItemDto {
  id: number;
  name: string;
  price: number;
}

export interface OrderItemDto {
  id: number;
  item: ItemDto | null;
  quantity: number;
}

export interface OrderDto {
  id: number;
  userId: number;
  status: string;
  totalPrice: number;
  items: OrderItemDto[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  name: string;
  surname: string;
  email: string;
  orderDto: OrderDto;
}
