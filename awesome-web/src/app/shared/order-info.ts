export interface UserOrder {
  userUID: string;
  name: string;
  imageUrl: string;
  price: number;
  isPaid: boolean;
  orderId?: string;
  date?: string;
  time?: string;
}
