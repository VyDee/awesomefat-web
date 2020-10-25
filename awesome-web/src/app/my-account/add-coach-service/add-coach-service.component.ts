import { StringValidator } from './../../validators/string.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoachingServiceInterface } from 'src/app/shared/product-info';

@Component({
  selector: 'add-coach-service',
  templateUrl: './add-coach-service.component.html',
  styleUrls: ['./add-coach-service.component.scss']
})
export class AddCoachServiceComponent implements OnInit {
  @Output() errors: EventEmitter<any> = new EventEmitter();

  originalService: CoachingServiceInterface = {
    name: null,
    detail: null,
    imageUrl: null,
    id: null,
    price: null
  };

  service: CoachingServiceInterface = {...this.originalService};

  addServiceForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.addServiceForm = this.formBuilder.group({
      serviceName: [this.service.name, [StringValidator.noBlank, Validators.minLength(10)]],
      serviceDetail: [this.service.detail, [StringValidator.noBlank]],
      imageUrl: [this.service.imageUrl],
      price: [this.service.price, [Validators.pattern(`^(0|[1-9][0-9]*)$`), StringValidator.noBlank]]
    });
  }

  isInvalidControl(controlName: string) {
    const control = this.addServiceForm.controls[controlName];
    return(this.submitted || control.dirty) && control.invalid;
  }

  onSubmit() {
    this.submitted = true;
    this.errors.emit(Object.keys(this.addServiceForm.controls).filter(key => this.addServiceForm.get(key).invalid));
    if (!this.addServiceForm.valid) {
      return;
    }
    console.log('submitting');
  }

}
