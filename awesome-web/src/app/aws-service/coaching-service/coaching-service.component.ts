import { CoachingServiceInterface } from './../../shared/product-info';
import { NotificationService } from './../../service/notification.service';
import { StringValidator } from './../../validators/string.validator';
import { CartComponent } from './cart/cart.component';
import { CoachingService } from '../../service/coaching.service';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ShoppingService } from 'src/app/service/shopping.service';
import { UserAuthService } from 'src/app/service/user-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-coaching-service',
  templateUrl: './coaching-service.component.html',
  styleUrls: ['./coaching-service.component.scss']
})
export class CoachingServiceComponent implements OnInit {
  @ViewChild(CartComponent) cart: CartComponent;
  @Output() errors: EventEmitter<any> = new EventEmitter();

  coachingServiceArr = [];
  totalOrderNumber: number;
  editServiceForm: FormGroup;

  currentServiceId: string;
  isUpdated = false;

  constructor(
    private coachingService: CoachingService,
    private shoppingService: ShoppingService,
    public userAuthService: UserAuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.coachingService.getCoachingServices().subscribe((services) => {
      this.coachingServiceArr = services;
    });
    this.createForm();
    this.getOrderNumber();
  }

  private createForm() {
    this.editServiceForm = this.formBuilder.group({
      name: ['', [Validators.minLength(5), Validators.required]],
      price: [null, [Validators.pattern(`^(0|[1-9][0-9]*)$`), Validators.required]],
      detail: ['', Validators.required]
    });
  }

  isInvalidControl(controlName: string) {
    const control = this.editServiceForm.controls[controlName];
    return(this.isUpdated || control.dirty) && control.invalid;
  }

  passServiceInfoForModal(service) {
    this.currentServiceId = service.id;
    this.editServiceForm.setValue({
      name: service.name,
      price: service.price,
      detail: service.detail
    });
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

  onUpdate(formValue) {
    this.isUpdated = true;
    this.errors.emit(Object.keys(this.editServiceForm.controls).filter(key => this.editServiceForm.get(key).invalid));
    if (!this.editServiceForm.valid) {
      return;
    }
    const updateService : CoachingServiceInterface = {
      id: +this.currentServiceId,
      name: formValue.name,
      detail: formValue.detail,
      price: formValue.price
    };
    this.coachingService.updateCoachingService(updateService);
    this.notificationService.showSuccess('success');
  }

  deleterService() {
    this.coachingService.deleteCoachingService(this.currentServiceId);
  }


}
