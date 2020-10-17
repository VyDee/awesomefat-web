import { Component, OnInit } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserAuthService } from 'src/app/service/user-auth.service';

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  allBookingOrders = [];
  userUID: string;

  constructor(
    private shoppingService: ShoppingService,
    public userAuthService: UserAuthService,
  ) { }

  ngOnInit(): void {
    this.getUserBookings();
    this.userUID = localStorage.getItem('userUID');
  }

  getUserBookings() {
    if(this.userAuthService.isAuthenticated()) {
      this.shoppingService.getOrders().subscribe((orders) => {
        this.allBookingOrders = orders.filter(x => x.userUID === this.userUID && x.isPaid === true);
      })
    }
  }

}
