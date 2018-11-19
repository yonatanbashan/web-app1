import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from './../../users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DateAdapter, MatDatepickerInputEvent } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {


  typedUserAlreadyExists = false;
  waitingCheck = false;
  user: User;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router) { }

  updateUserForm: FormGroup;
  date: Date;
  headerText: string = '';
  hideDate: boolean = false;
  isLoading: boolean;
  userInfo: any = {};

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUserInfo(this.authService.getActiveUser())
    .subscribe((response) => {

      this.userInfo = response.userInfo;
      this.initUserInfo();
      this.isLoading = false;
    });
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
      'hideDate': new FormControl(this.userInfo.hideDate, [])
    });
  }

  onSubmit() {
    this.headerText = this.updateUserForm.value.headerText;
    this.hideDate = this.updateUserForm.value.hideDate;
    const info = {
      headerText: this.headerText,
      hideDate: this.hideDate,
      birthDate: this.date.toDateString()
    };
    this.isLoading = true;
    this.usersService.updateUserInfo(info)
    .subscribe(response => {
      this.isLoading = false;
      this.router.navigate(['/user', this.authService.getActiveUser()]);
    });
  }

  dateChangedEvent(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = new Date(event.value);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    this.date = new Date(year, month, day)
  }


}
