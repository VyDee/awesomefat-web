import { ActivatedRoute } from '@angular/router';
import { Component, DoCheck, OnInit } from '@angular/core';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserAuthService } from 'src/app/service/user-auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, DoCheck {
  totalNumber = 0;
  totalOrders = [];
  totalPrice: number;
  userUID: string;
  id: number;
  constructor(
    private shoppingService: ShoppingService,
    public userAuthService: UserAuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cartNumberUpdate();
    this.id = +this.route.snapshot.params.id;
    this.userUID = localStorage.getItem('userUID');
    console.log('I am in cart -- totalOrders', this.totalOrders);
  }
  ngDoCheck(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === null) {
      this.totalNumber = 0;
    }
  }
  cartNumberUpdate() {
    console.log(this.userAuthService.isAuthenticated());

    if (this.userAuthService.isAuthenticated())
    {
      this.shoppingService.getOrders().subscribe((orders) => {
        this.totalOrders = orders.filter(x => x.userUID === this.userUID && x.isPaid === false);
        this.totalNumber = this.totalOrders.length;

        const priceArr = this.totalOrders.map(t => t.price);
        this.totalPrice = priceArr.reduce((acc, cur) => acc + cur, 0);
        console.log(this.totalPrice);
      });
    }
  }

  changeToPaidOrder() {
    for (let i = 0; i < this.totalOrders.length; i++) {
      this.totalOrders[i].isPaid = true;
      this.shoppingService.updateOrder(this.totalOrders[i]);
    }
  }

}
