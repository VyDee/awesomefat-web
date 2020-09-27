import { CartComponent } from './../cart/cart.component';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent implements OnInit {
  id: number;

  constructor(
    private cart: CartComponent
  ) { }

  ngOnInit(): void {
    this.id = this.cart.id;
  }

}
