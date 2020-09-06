import { UserContactMessage } from './../shared/user-contact-message';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  originalUserContactMessage: UserContactMessage = {
    firstName: null,
    lastName: null,
    companyName: null,
    userEmail: null,
    service: null,
    userMessage: null
  };
  userContactMessage: UserContactMessage = {...this.originalUserContactMessage};

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form) {
    console.log(form.value);
  }

}
