import { DatePipe } from '@angular/common';
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
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.cartNumberUpdate();
    this.id = +this.route.snapshot.params.id;
    this.userUID = localStorage.getItem('userUID');
  }
  ngDoCheck(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === null) {
      this.totalNumber = 0;
    }
  }
  cartNumberUpdate() {
    if (this.userAuthService.isAuthenticated())
    {
      this.shoppingService.getOrders().subscribe((orders) => {
        this.totalOrders = orders.filter(x => x.userUID === this.userUID && x.isPaid === false);
        this.totalNumber = this.totalOrders.length;

        const priceArr = this.totalOrders.map(t => t.price);
        this.totalPrice = priceArr.reduce((acc, cur) => Number(acc) + Number(cur), 0);
      });
    }
  }

  changeToPaidOrder() {
    for (let i = 0; i < this.totalOrders.length; i++) {
      const today = new Date();
      this.totalOrders[i].isPaid = true;
      this.totalOrders[i].purchasedDate = this.datePipe.transform(today,'yyyy-MM-dd');
      this.shoppingService.updateOrder(this.totalOrders[i]);
    }
  }

}
