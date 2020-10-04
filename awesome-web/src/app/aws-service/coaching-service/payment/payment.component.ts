import { Component, OnInit } from '@angular/core';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  id: number;
  constructor(
    private cart: CartComponent
  ) { }

  ngOnInit(): void {
    this.id = this.cart.id;
  }

}
