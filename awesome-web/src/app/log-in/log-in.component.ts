import { UserLogInInfo } from './../shared/user-login';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  originalUserLoginInfo: UserLogInInfo = {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    password: null
  };

  userSigninInfo : UserLogInInfo = { ... this.originalUserLoginInfo };
  userSignupInfo : UserLogInInfo = { ... this.originalUserLoginInfo };
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form) {
    console.log(form.value);
  }

}
