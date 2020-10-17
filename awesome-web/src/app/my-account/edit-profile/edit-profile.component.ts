import { PasswordValidators } from './../../validators/password.validator';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { StringValidator } from './../../validators/string.validator';
import { UserAuthService } from './../../service/user-auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserInfo } from './../../shared/user-info';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @Output() errors: EventEmitter<any> = new EventEmitter();

  originalUserProfile: UserInfo = {
    firstName: this.userAuthService.currentUser.firstName,
    lastName: this.userAuthService.currentUser.lastName,
    phoneNumber: this.userAuthService.currentUser.phoneNumber,
    userEmail: this.userAuthService.currentUser.userEmail,
    password: this.userAuthService.currentUser.password
  };

  userProfile: UserInfo = {...this.originalUserProfile};
  userProfileForm: FormGroup;
  isEdited = false;
  isResetPassword = false;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.userProfileForm = this.formBuilder.group({
      firstName: [this.userProfile.firstName, [StringValidator.noBlank, Validators.maxLength(100)]],
      lastName: [this.userProfile.lastName, [StringValidator.noBlank, Validators.maxLength(100)]],
      phoneNumber: [this.userProfile.phoneNumber, [StringValidator.noBlank, Validators.maxLength(15)]],
      userEmail: [this.userProfile.userEmail,
        [StringValidator.noBlank,
        Validators.maxLength(100),
        Validators.email,
        Validators.pattern(`.*@.*[.].[^0-9][a-zA-Z]`)
      ]],
      oldPassword: [this.userProfile.password,
        [StringValidator.noBlank,
        Validators.maxLength(100)
      ]],
      newPassword:[],
      confirmedPassword:[]
    }, {
      validator: PasswordValidators.ConfirmedValidator('newPassword', 'confirmedPassword')
    }
    );
  }

  private resetPassword() {
    this.isResetPassword = !this.isResetPassword;
    this.userProfileForm.get('newPassword').reset();
    this.userProfileForm.get('confirmedPassword').reset();
  }

  isInvalidControl(controlName: string) {
    const control = this.userProfileForm.controls[controlName];
    return(this.userProfileForm || control.dirty) && control.invalid;
  }

  onSubmit() {
    this.isEdited = !this.isEdited;
    if (!this.userProfileForm.valid && this.isEdited === false) {
      this.isEdited = true;
      return;
    }
    if (this.isEdited === true){
      this.isSubmitted = true;
      this.errors.emit(Object.keys(this.userProfileForm.controls).filter(key => this.userProfileForm.get(key).invalid));
      console.log('I am editing');
    } else {
      this.isResetPassword = false;
    }
  }
}
