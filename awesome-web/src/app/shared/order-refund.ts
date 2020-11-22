export interface OrderRefund {
  refundId?: string;
  name: string;
  userUID: string;
  orderId: string;
  imageUrl: string;
  price: number;
  purchasedDate: string;
  status: string;
  customerName?: string;
}
