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