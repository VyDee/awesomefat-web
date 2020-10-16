import { CartComponent } from './cart/cart.component';
import { CoachingService } from '../../service/coaching.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserAuthService } from 'src/app/service/user-auth.service';

@Component({
  selector: 'app-coaching-service',
  templateUrl: './coaching-service.component.html',
  styleUrls: ['./coaching-service.component.scss']
})
export class CoachingServiceComponent implements OnInit {
  @ViewChild(CartComponent) cart: CartComponent;

  coachingServiceArr = [];
  totalOrderNumber: number;

  constructor(
    private coachingService: CoachingService,
    private shoppingService: ShoppingService,
    public userAuthService: UserAuthService,
  ) {}

  ngOnInit(): void {
    this.coachingService.getCoachingServices().subscribe((services) => {
      this.coachingServiceArr = services;
    });
    this.getOrderNumber();
  }

  getOrderNumber() {
    const userUID = localStorage.getItem('userUID');
    if (this.userAuthService.isAuthenticated())
    {
      this.shoppingService.getOrders().subscribe((orders) => {
        const totalOrders = orders.filter(x => x.userUID === userUID && x.isPaid === false);
        this.totalOrderNumber = totalOrders.length;
      });
    }
  }



}
