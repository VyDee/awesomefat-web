import { OrderRefund } from './../../shared/order-refund';
import { RefundService } from './../../service/refund.service';
import { UserInfo } from './../../shared/user-info';
import { UserOrder } from './../../shared/order-info';
import { Component, OnInit } from '@angular/core';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserAuthService } from 'src/app/service/user-auth.service';

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  allBookingOrders: UserOrder[] = [];
  usersArray: UserInfo[] = [];
  userUID: string;

  constructor(
    private shoppingService: ShoppingService,
    public userAuthService: UserAuthService,
    private refundService: RefundService
  ) { }

  ngOnInit(): void {
    this.getUserBookings();
    this.getAllUsers();
    this.userUID = localStorage.getItem('userUID');
  }

  getUserBookings(): any {
    if (this.userAuthService.isAuthenticated()) {
      if (this.userAuthService.currentUser.role === 'admin'){
          this.shoppingService.getOrders().subscribe((orders) => {
          this.allBookingOrders = orders as UserOrder[];
        });
      } else {
          this.shoppingService.getOrders().subscribe((orders) => {
          this.allBookingOrders = orders.filter(x => x.userUID === this.userUID && x.isPaid === true) as UserOrder[];
        });
      }
    }
  }

  getAllUsers(): void {
    this.userAuthService.getUsers().subscribe((results) => {
      this.usersArray = results;
    });
  }

  getBuyerName(userUID): string {
    const buyers = this.usersArray.filter(x => x.userUID === userUID);
    if(buyers) {
      return buyers[0].firstName + ' ' + buyers[0].lastName;
    } else {
      return '';
    }
  }

  deleteOrder(order: UserOrder){
    const refundOrder: OrderRefund = {
      userUID : order.userUID,
      orderId: order.orderId,
      imageUrl: order.imageUrl,
      price: order.price,
      purchasedDate: order.purchasedDate,
      status: 'Refund'
    };
    this.refundService.addRefund(refundOrder);
    this.shoppingService.deleteOrder(order);
  }
}
