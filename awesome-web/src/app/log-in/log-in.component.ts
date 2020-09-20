import { CommonModule } from '@angular/common';
import { UserFirebaseService } from './../service/user-firebase.service';
import { StringValidator } from './../validators/string.validator';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserInfo } from '../shared/user-info';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
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
    private router: Router,
    private userFirebaseService: UserFirebaseService,
    private notificationService: NotificationService
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
        };
        this.userFirebaseService.addUsers(newUser);
        this.notificationService.showSuccess('The user has been created. Please sign in.');
        this.resetSignUpForm();
        this.signUpSubmitted = false;
        }, (error) => {
          if (error.code ='auth/email-already-in-use'){
            this.existedEmail = true;
          }
        });
  }

  onLogin() {
    const values = this.signInForm.value;
    const request = {
      email: values.signInEmail,
      password: values.signInPw
    };
    this.auth
      .signInWithEmailAndPassword(request.email, request.password)
      .then(() => {
        console.log("Sign in successfully")
        this.router.navigate([''])
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
      this.onLogin();
    }
  }
}
