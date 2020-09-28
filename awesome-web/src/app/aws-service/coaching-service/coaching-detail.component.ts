import { UserOrder } from './../../shared/order-info';
import { ShoppingService } from './../../service/shopping.service';
import { UserAuthService } from './../../service/user-auth.service';
import { CoachingService } from './../../service/coaching.service';
import { CoachingServiceInterface } from './../../shared/product-info';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-coaching-detail',
  templateUrl: './coaching-detail.component.html',
  styleUrls: ['./coaching-detail.component.scss']
})
export class CoachingDetailComponent implements OnInit {
  service: CoachingServiceInterface;

  constructor(
    private route: ActivatedRoute,
    private coachingService: CoachingService,
    public userAuthService: UserAuthService,
    private notificationService: NotificationService,
    private shoppingService: ShoppingService,
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.params.id;
    this.coachingService.getCoachingService(id).subscribe((result) => {
      this.service = result;
    });
  }

  addToCart(){
    if (!this.userAuthService.isAuthenticated()){
      this.notificationService.showInfo('Please log in before adding to the cart');
    }
    else {
      const order: UserOrder = {
        userUID: this.userAuthService.currentUser.userUID,
        name: this.service.name,
        imageUrl: this.service.imageUrl,
        price: this.service.price,
        date: '',
        time: ''
      };
      this.shoppingService.addOrder(order);
    }

  }
}
