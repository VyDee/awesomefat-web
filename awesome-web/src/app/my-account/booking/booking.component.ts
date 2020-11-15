import { MessageService } from './../../service/message.service';
import { filter } from 'rxjs/operators';
import { CoachingService } from './../../service/coaching.service';
import { NotificationService } from './../../service/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderRefund } from './../../shared/order-refund';
import { RefundService } from './../../service/refund.service';
import { UserInfo } from './../../shared/user-info';
import { UserOrder } from './../../shared/order-info';
import { Component, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserAuthService } from 'src/app/service/user-auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, DoCheck {
  allBookingOrders: UserOrder[] = [];
  usersArray: UserInfo[] = [];
  userUID: string;
  updateSessionForm: FormGroup;
  meetingTime: any;
  meetingDate: any;
  currentOrderId: string;


  // Filter
  filterCategory: string;
  isCategoryChosen = false;
  filterOption = 'all';
  serviceTypeArr = []; // this is only for getting the type of services for the select option
  filterArray = [];


  constructor(
    private shoppingService: ShoppingService,
    public userAuthService: UserAuthService,
    private refundService: RefundService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private coachingService: CoachingService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getUserBookings();
    this.getAllUsers();
    this.userUID = localStorage.getItem('userUID');
    this.createForm();
    this.coachingService.getCoachingServices().subscribe((services) => {
      this.serviceTypeArr = services;
    });
  }

  ngDoCheck() {
    this.meetingDate = this.updateSessionForm.controls.meetingDate.value;
    this.meetingTime = this.updateSessionForm.controls.meetingTime.value;

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
          this.filterArray = [...this.allBookingOrders];
        });
      } else {
          this.shoppingService.getOrders().subscribe((orders) => {
          this.allBookingOrders = orders.filter(x => x.userUID === this.userUID && x.isPaid === true) as UserOrder[];
          this.filterArray = [...this.allBookingOrders];
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
    if (buyers[0]) {
      return buyers[0].firstName + ' ' + buyers[0].lastName;
    } else {
      return '';
    }
  }

  deleteOrder(){
    const booking = this.allBookingOrders.filter(x => x.orderId === this.currentOrderId)[0];
    const refundOrder: OrderRefund = {
      userUID : booking.userUID,
      orderId: booking.orderId,
      imageUrl: booking.imageUrl,
      price: booking.price,
      purchasedDate: booking.purchasedDate,
      status: 'Refund'
    };
    this.refundService.addRefund(refundOrder);
    this.shoppingService.deleteOrder(booking.orderId);
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
    const buyers = this.usersArray.filter(x => x.userUID === booking.userUID);
    booking.time = this.updateSessionForm.controls.meetingTime.value;
    booking.scheduledDate = this.updateSessionForm.controls.meetingDate.value;
    this.shoppingService.updateOrder(booking);

    const request = {
      userEmail: buyers[0]?.userEmail,
      name: buyers[0]?.firstName,
      service: booking.name,
      meetingTime: booking.time,
      meetingDate: booking.scheduledDate,
      templateName: 'booking-time-update'
    };
    this.messageService.sendEmail(request).subscribe(
      data => {},
      err => {
        console.log(err);
      }, () => {
        this.notificationService.showSuccess('The meeting time and date has been successfully updated. An email has been sent to the user for the updated information');
      }
    );
  }

  isNotNullOrEmpty(value) {
    return value !== null && value !== ''  && value !== undefined;
  }

  setFilterCategory(event: any) {
    this.filterCategory = event.target.value;
    this.isCategoryChosen = this.filterCategory ? true : false;
  }

  setfilterOptions(event: any) {
    this.filterOption = event.target.value;
  }

  onSort(){
    let filterService = [... this.allBookingOrders];
    if (this.filterOption !== 'all')
    {
      switch (this.filterCategory) {
        case 'service':
          filterService = filterService.filter(x => x.name === this.filterOption);
        case 'price':
          filterService = filterService.sort((n1, n2) => this.filterOption === 'asc' ? n1.price - n2.price : n2.price - n1.price);
        case 'meetingDate':
          const scheduledMeetingArray = filterService.filter(x => x.scheduledDate !== '');
          const notSchefuledArray = filterService.filter(x => x.scheduledDate === '');
          filterService = scheduledMeetingArray.sort((d1, d2) =>
          this.filterOption === 'asc' ?
            (+new Date (d1.scheduledDate)) - (+new Date (d2.scheduledDate)) :
            (+new Date (d2.scheduledDate)) - (+new Date (d1.scheduledDate)));
          filterService = scheduledMeetingArray.concat(notSchefuledArray);
        case 'purchasedDate':
          filterService = filterService.sort((d1, d2) =>
          this.filterOption === 'asc' ?
            (+new Date (d1.purchasedDate)) - (+new Date (d2.purchasedDate)) :
            (+new Date (d2.purchasedDate)) - (+new Date (d1.purchasedDate)));
        default:
          break;
      }
    }
    this.filterArray = filterService;
  }
}
