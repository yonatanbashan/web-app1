import { UsersService } from '../users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit, OnDestroy {

  submitClicked = false;
  isAuthSubs: Subscription;
  isLoading = false;

  constructor(
    private usersService: UsersService,
    private router: Router) { }
    signInForm: FormGroup;

  ngOnInit() {
    this.signInForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.minLength(6)),
    });
    this.isAuthSubs = this.usersService.getAuthStatusListener().subscribe((isAuth) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.isAuthSubs.unsubscribe();
  }

  getActiveUser() {
    return this.usersService.getActiveUser();
  }

  isUserExist() {
    return this.usersService.isUserExist();
  }

  onSubmit() {
    this.usersService.getUser(
            this.signInForm.value.username,
            this.signInForm.value.password);
    this.submitClicked = true;
    this.isLoading = true;
  }

  onLogout() {
    this.usersService.logout();
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }


}
