import { StringValidator } from './../validators/string.validator';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserLogInInfo } from './../shared/user-login';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  @Output() errors: EventEmitter<any> = new EventEmitter();

  originalUserLoginInfo: UserLogInInfo = {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    userEmail: null,
    password: null
  };

  userSigninInfo : UserLogInInfo = { ... this.originalUserLoginInfo };
  userSignUpInfo : UserLogInInfo = { ... this.originalUserLoginInfo };
  signInForm: FormGroup;
  signUpForm: FormGroup;
  signInSubmitted = false;
  signUpSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router
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
      signUpPw: [this.userSignUpInfo.password, [StringValidator.noBlank, Validators.required, Validators.maxLength(50)]],
    });
  }

  createUser() {
    console.log("I am in create user");
    const values = this.signInForm.value;
    const request = {
      email: values.signInEmail,
      password: values.signInPw
    };

    this.auth.createUserWithEmailAndPassword(request.email, request.password).then((user) => {
      console.log("createUser ", user);
      this.router.navigate(['']);
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
    console.log(form);
    this.signInSubmitted = (form === this.signInForm) ? true : false;
    this.signUpSubmitted = (form === this.signUpForm) ? true : false;
    this.errors.emit(Object.keys(form.controls).filter(key => form.get(key).invalid));
    console.log(form.value);
    if (!form.valid) {
      return;
    }
    this.createUser()
  }

}
