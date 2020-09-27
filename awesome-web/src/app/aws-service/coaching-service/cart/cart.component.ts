import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserAuthService } from 'src/app/service/user-auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  totalNumber = 0;
  totalOrders;
  id: number;
  constructor(
    private shoppingService: ShoppingService,
    public userAuthService: UserAuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cartNumberUpdate();
    this.id = +this.route.snapshot.params.id;
  }

  cartNumberUpdate() {
    if(this.userAuthService.isAuthenticated())
    {
      this.shoppingService.getOrders().subscribe((orders) => {
        this.totalOrders = orders.filter(x => x.userUID === this.userAuthService.currentUser.userUID);
        this.totalNumber = this.totalOrders.length;
      })
    }
  }

}
