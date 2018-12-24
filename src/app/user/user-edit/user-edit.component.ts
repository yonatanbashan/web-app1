import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from './../../users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { MatDatepickerInputEvent } from '@angular/material';
import { Router } from '@angular/router';
import { mimeType } from 'src/app/common/mime-type.validator'

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @ViewChild('filePicker') filePicker: ElementRef;

  typedUserAlreadyExists = false;
  waitingCheck = false;
  user: User;
  imagePreview: string;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router) { }

  updateUserForm: FormGroup;
  date: Date;
  headerText: string = '';
  hideDate: boolean = false;
  isLoading: boolean;
  isDeletingImage = false;
  userInfo: any = {};

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUserInfo(this.authService.getActiveUser())
    .subscribe(this.processUserInfoResponse);
  }

  processUserInfoResponse = (response) => {
    this.userInfo = response.userInfo;
    this.initUserInfo();
    this.isLoading = false;
    if(this.userInfo.profileImagePath) {
      this.imagePreview = this.userInfo.profileImagePath;
    }
  }

  initUserInfo() {

    if (this.userInfo.birthDate) {
      this.date = new Date(this.userInfo.birthDate);
    } else {
      this.date = new Date();
    }

    if (this.userInfo.headerText) {
      this.headerText = this.userInfo.headerText;
    }

    this.userInfo.hideDate = this.userInfo.hideDate ? true : false;

    this.updateUserForm = new FormGroup({
      'date': new FormControl(this.date, []),
      'headerText': new FormControl(this.headerText, []),
      'hideDate': new FormControl(this.userInfo.hideDate, []),
      'userImage': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
  }

  onSubmit() {
    this.headerText = this.updateUserForm.value.headerText;
    this.hideDate = this.updateUserForm.value.hideDate;
    let info = {
      headerText: this.headerText,
      hideDate: this.hideDate,
      birthDate: this.date.toDateString(),
      profileImagePath: undefined
    };

    if( (this.userInfo.profileImagePath !== undefined) &&
        !this.updateUserForm.value.userImage) {
      info.profileImagePath = this.userInfo.profileImagePath;
    }

    this.isLoading = true;
    this.usersService.updateUserInfo(info, this.updateUserForm.value.userImage);
  }

  dateChangedEvent(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = new Date(event.value);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    this.date = new Date(year, month, day)
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.updateUserForm.patchValue({ 'userImage': file });
    this.updateUserForm.get('userImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  onDeleteImage() {
    this.isDeletingImage = true;
    this.usersService.deleteUserImage()
    .subscribe(response => {
      this.ngOnInit();
      this.isDeletingImage = false;
      this.imagePreview = '';
      this.updateUserForm.patchValue({ 'userImage': null });
    });
  }


}
