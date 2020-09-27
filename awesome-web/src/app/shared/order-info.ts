import { Interface } from 'readline';

export interface UserOrder {
  userUID: string;
  name: string;
  imageUrl: string;
  price: number;
}
