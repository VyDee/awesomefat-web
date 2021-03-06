import { MessageService } from './../service/message.service';
import { UserAuthService } from '../service/user-auth.service';
import { StringValidator } from './../validators/string.validator';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserInfo } from '../shared/user-info';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotificationService } from '../service/notification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  @Output() errors: EventEmitter<any> = new EventEmitter();

  originalUserLoginInfo: UserInfo = {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    userEmail: null,
    password: null
  };

  userSigninInfo: UserInfo = { ... this.originalUserLoginInfo };
  userSignUpInfo: UserInfo = { ... this.originalUserLoginInfo };
  signInForm: FormGroup;
  signUpForm: FormGroup;
  signInSubmitted = false;
  signUpSubmitted = false;
  existedEmail = false;
  passwordTooShort = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private userAuthService: UserAuthService,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.createSignInForm();
    this.createSignUpForm();
  }

  private createSignInForm() {
    this.signInForm = this.formBuilder.group({
      signInEmail: new FormControl(
        this.userSigninInfo.userEmail,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(`.*@.*[.].[^0-9][a-zA-Z]`)
        ]
      ),
      signInPw: new FormControl(this.userSigninInfo.password, [StringValidator.noBlank, Validators.required, Validators.maxLength(50)])
    });
  }

  private createSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      firstName: [this.userSignUpInfo.firstName, [StringValidator.noBlank, Validators.required, Validators.maxLength(100)]],
      lastName: [this.userSignUpInfo.lastName, [StringValidator.noBlank, Validators.required, Validators.maxLength(100)]],
      phoneNumber: [this.userSignUpInfo.phoneNumber, [StringValidator.noBlank, Validators.required, Validators.maxLength(12)]],
      signUpEmail: [
        this.userSignUpInfo.userEmail,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(`.*@.*[.].[^0-9][a-zA-Z]`)
        ]
      ],
      signUpPw: [this.userSignUpInfo.password, [StringValidator.noBlank, Validators.required, Validators.maxLength(50), Validators.minLength(6)]]
    });
  }

  private resetSignUpForm() {
    this.signUpForm.get('firstName').reset();
    this.signUpForm.get('lastName').reset();
    this.signUpForm.get('phoneNumber').reset();
    this.signUpForm.get('signUpEmail').reset();
    this.signUpForm.get('signUpPw').reset();
  }

  createUser() {
    const values = this.signUpForm.value;
    const request = {
      email: values.signUpEmail,
      password: values.signUpPw
    };
    this.auth.createUserWithEmailAndPassword(request.email, request.password)
      .then((user) => {
        this.existedEmail = false;
        const newUser: UserInfo = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          userEmail: values.signUpEmail,
          password: values.signUpPw,
          userUID: user.user.uid
        };
        this.userAuthService.addUsers(newUser);
        this.notificationService.showSuccess('The user has been created. An confirm email has been sent to your email. Please sign in tp continue.');

        const request = {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          userEmail: newUser.userEmail,
          templateName: 'sign-up'
        };
        this.messageService.sendEmail(request).subscribe(
          err => {
            console.log(err);
          }
        );
        this.signUpSubmitted = false;
        this.resetSignUpForm();
        }, (error) => {
          if (error.code = 'auth/email-already-in-use'){
            this.existedEmail = true;
          }
        });
  }

  isSignInInvalidControl(controlName: string){
    const control = this.signInForm.controls[controlName];
    return(this.signInSubmitted || control.dirty) && control.invalid;
  }
  isSignUpInvalidControl(controlName: string){
    const control = this.signUpForm.controls[controlName];
    return(this.signUpSubmitted || control.dirty) && control.invalid;
  }

  onSubmit(form: FormGroup) {
    this.signInSubmitted = (form === this.signInForm) ? true : false;
    this.signUpSubmitted = (form === this.signUpForm) ? true : false;
    this.errors.emit(Object.keys(form.controls).filter(key => form.get(key).invalid));
    if (!form.valid) {
      return;
    }
    if (form === this.signUpForm) {
      this.createUser();
    }
    else {
      const values = this.signInForm.value;
      this.userAuthService.onLogin(values.signInEmail, values.signInPw);
    }
  }
}
