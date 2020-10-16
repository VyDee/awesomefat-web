export interface UserOrder {
  userUID: string;
  name: string;
  imageUrl: string;
  price: number;
  isPaid: boolean;
  purchasedDate?: string;
  orderId?: string;
  scheduledDate?: string;
  time?: string;
}
