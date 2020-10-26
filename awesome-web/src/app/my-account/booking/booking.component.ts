import { NotificationService } from './../../service/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderRefund } from './../../shared/order-refund';
import { RefundService } from './../../service/refund.service';
import { UserInfo } from './../../shared/user-info';
import { UserOrder } from './../../shared/order-info';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserAuthService } from 'src/app/service/user-auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  allBookingOrders: UserOrder[] = [];
  usersArray: UserInfo[] = [];
  userUID: string;
  updateSessionForm: FormGroup;
  meetingTime: any;
  meetingDate: any;
  currentOrderId: string;


  constructor(
    private shoppingService: ShoppingService,
    public userAuthService: UserAuthService,
    private refundService: RefundService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getUserBookings();
    this.getAllUsers();
    this.userUID = localStorage.getItem('userUID');
    this.createForm();
  }

  private createForm() {
    this.updateSessionForm = this.formBuilder.group({
      meetingTime: [this.meetingTime, Validators.required],
      meetingDate: [this.meetingDate, Validators.required]
    });
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
    if (buyers) {
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

  passBookingInfoForModal(booking) {
    this.currentOrderId = booking.orderId;
    this.meetingTime = booking.time ? booking.time : '';
    this.meetingDate = booking.scheduledDate ? booking.scheduledDate : '';
    this.updateSessionForm.setValue({
      meetingTime: this.meetingTime,
      meetingDate: this.meetingDate
    });
  }

  updateSessionInfo() {
    const booking = this.allBookingOrders.filter(x => x.orderId === this.currentOrderId)[0];
    booking.time = this.updateSessionForm.controls.meetingTime.value;
    booking.scheduledDate = this.updateSessionForm.controls.meetingDate.value;

    this.shoppingService.updateOrder(booking);
    this.notificationService.showSuccess('The meeting time and date has been successfully updated');

  }
}
