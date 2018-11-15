import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  authDenied = false;

  constructor(
    private authService: AuthService,
    private router: Router) { }
    signInForm: FormGroup;

  ngOnInit() {
    this.signInForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.minLength(6)),
    });
    this.isAuthSubs = this.authService.getAuthStatusListener().subscribe((isAuth) => {
      this.isLoading = false;
      if (!isAuth) {
        this.authDenied = true;
        this.signInForm.reset();
      } else {
        this.authDenied = false;
      }
    });
  }

  ngOnDestroy() {
    this.isAuthSubs.unsubscribe();
  }

  getActiveUser() {
    return this.authService.getActiveUser();
  }

  isUserExist() {
    return this.authService.isUserExist();
  }

  onSubmit() {
    this.authService.signIn(
            this.signInForm.value.username,
            this.signInForm.value.password);
    this.submitClicked = true;
    this.isLoading = true;
  }

  onLogout() {
    this.authService.logout();
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }


}
