export interface OrderRefund {
  refundId?: string;
  userUID: string;
  orderId: string;
  imageUrl: string;
  price: number;
  purchasedDate: string;
  status: string;
}
