import { NavbarComponent } from './../../../navbar/navbar.component';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserOrder } from './../../../shared/order-info';
import { UserAuthService } from 'src/app/service/user-auth.service';
import { CartComponent } from './../cart/cart.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent implements OnInit {
  id: number;
  ordersArray = [];

  constructor(
    private cart: CartComponent,
    public userAuthService: UserAuthService,
    private shoppingService: ShoppingService
  ) { }

  ngOnInit(): void {
    this.id = this.cart.id;
  }

  deleteOrder(order: UserOrder){
    this.shoppingService.deleteOrder(order.orderId);
    this.cart.totalNumber = this.ordersArray.length;
  }

}
