import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild, ElementRef, DoCheck, Renderer2 } from '@angular/core';
import { CartComponent } from '../cart/cart.component';

declare var paypal;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, DoCheck {
  @ViewChild('paypal', {static : true}) paypalElement: ElementRef;
  id: number;

  paidFor = false;
  constructor(
    public cart: CartComponent,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'coaching services',
                amount: {
                  currency_code: 'USD',
                  value: this.cart.totalPrice
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          this.cart.changeToPaidOrder();
          console.log(order);
        },
        onError: err => {
          console.log(err);
        },
        style: {
          layout:'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        }
      })
      .render(this.paypalElement.nativeElement);
  }

  ngDoCheck() {
    if(this.paidFor || this.cart.totalPrice === 0) {
      this.renderer.setStyle(this.paypalElement.nativeElement, 'display', 'none');
    }
    else {
      this.renderer.removeStyle(this.paypalElement.nativeElement, 'display');
    }
  }

}
