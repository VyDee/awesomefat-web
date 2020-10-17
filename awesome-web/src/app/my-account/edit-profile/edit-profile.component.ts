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
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService
  ) { }

  ngOnInit(): void {
    this.createForm();
    console.log(this.userAuthService.currentUser.password);
  }

  private createForm() {
    this.userProfileForm = this.formBuilder.group({
      firstName: [this.userProfile.firstName,[StringValidator.noBlank,Validators.maxLength(100)]],
      lastName: [this.userProfile.lastName,[StringValidator.noBlank,Validators.maxLength(100)]],
      phoneNumber:[this.userProfile.phoneNumber,[StringValidator.noBlank,Validators.maxLength(15)]],
      userEmail:[this.userProfile.userEmail,[StringValidator.noBlank, Validators.maxLength(100)]],
      password: [this.userProfile.password,[StringValidator.noBlank, Validators.maxLength(100)]]
    })
  }

  isInvalidControl(controlName: string) {
    const control = this.userProfileForm.controls[controlName];
    return(this.userProfileForm || control.dirty) && control.invalid;
  }

  onSubmit() {
    this.submitted = true;
    this.errors.emit(Object.keys(this.userProfileForm.controls).filter(key => this.userProfileForm.get(key).invalid));

    if (!this.userProfileForm.valid) {
      return;
    }
  }
}
