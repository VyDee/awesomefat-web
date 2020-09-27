export interface UserOrder {
  userUID: string;
  name: string;
  imageUrl: string;
  price: number;
  orderId?: string;
  date?: string;
  time?: string;
}
