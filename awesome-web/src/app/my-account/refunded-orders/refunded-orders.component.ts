import { RefundService } from './../../service/refund.service';
import { UserAuthService } from './../../service/user-auth.service';
import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'refunded-orders',
  templateUrl: './refunded-orders.component.html',
  styleUrls: ['./refunded-orders.component.scss']
})
export class RefundedOrdersComponent implements OnInit, DoCheck {

  customerString = '';
  allRefundedOrders = [];
  filterArray = [];
  constructor(
    private userAuthService: UserAuthService,
    private refundService: RefundService
  ) { }

  ngOnInit(): void {
    this.getRefundedBookings();
  }

  ngDoCheck() {
    console.log(this.customerString);
    this.filterOrder();
  }


  getRefundedBookings(): any {
    if (this.userAuthService.isAuthenticated()) {
      if (this.userAuthService.currentUser.role === 'admin') {
        this.refundService.getRefunds().subscribe((services) => {
          this.allRefundedOrders = services;
        });
      }
    }
  }

  filterOrder() {
    const filterService = [... this.allRefundedOrders];
    if (this.customerString !== '') {
      console.log('in here');
      this.filterArray = filterService.filter(x => (x.customerName.toLowerCase().indexOf(this.customerString.toLowerCase())) >= 0);
    }
    else {
      this.filterArray = this.allRefundedOrders;
    }
  }
}
