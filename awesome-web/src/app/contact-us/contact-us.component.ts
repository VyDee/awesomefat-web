import { MessageService } from './../service/message.service';
import { StringValidator } from './../validators/string.validator';
import { UserContactMessage } from './../shared/user-contact-message';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  @Output() errors: EventEmitter<any> = new EventEmitter();

  originalUserContactMessage: UserContactMessage = {
    firstName: null,
    lastName: null,
    companyName: null,
    userEmail: null,
    service: null,
    userMessage: null
  };
  userContactMessage: UserContactMessage = {...this.originalUserContactMessage};
  userForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.userForm = this.formBuilder.group({
      firstName: [this.userContactMessage.firstName, [StringValidator.noBlank, Validators.required, Validators.maxLength(100)]],
      lastName: [this.userContactMessage.lastName, [StringValidator.noBlank, Validators.required, Validators.maxLength(100)]],
      companyName: [this.userContactMessage.companyName, [StringValidator.noBlank, Validators.required, Validators.maxLength(100)]],
      userEmail: [
        this.userContactMessage.userEmail,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(`.*@.*[.].[^0-9][a-zA-Z]`)
        ]
      ],
      service: [this.userContactMessage.service, [StringValidator.noBlank, Validators.required, Validators.maxLength(100)]],
      userMessage: [this.userContactMessage.userMessage, [StringValidator.noBlank]]
    });
  }

  isInvalidControl(controlName: string) {
    const control = this.userForm.controls[controlName];
    return(this.submitted || control.dirty) && control.invalid;
  }




  // sendMessage(body) {
  //   return this._http.post('http://localhost:3000/sendmail', body);
  // }
  onSubmit() {
    this.submitted = true;
    this.errors.emit(Object.keys(this.userForm.controls).filter(key => this.userForm.get(key).invalid));

    if (!this.userForm.valid) {
      return;
    }

    const values = this.userForm.value;
    const request = {
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName,
      userEmail: values.userEmail,
      service: values.service,
      userMessage: values.userMessage
    };

    // this.messageService.sendMessage('http://localhost:3000/sendmail', request);

  }

}
