import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  typedUserAlreadyExists = false;
  waitingCheck = false;

  constructor(private authService: AuthService) { }

  signupForm: FormGroup;
  checkSubs: Subscription;

  // Font-awesome objects
  faUser = faUser;
  faKey = faKey;

  ngOnInit() {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.pattern('[\-\_a-zA-Z0-9\.]*'), Validators.minLength(4), Validators.maxLength(15)]),
      'password': new FormControl(null, [Validators.minLength(6)]),
      'repeatPassword': new FormControl(null, Validators.minLength(6)),
    });
  }

  onCheckTypedUserAlreadyExists() {
    if (this.checkSubs !== undefined) {
      this.checkSubs.unsubscribe();
    }
    if (this.signupForm.value.username === '') {
      this.waitingCheck = false;
      this.typedUserAlreadyExists = false;
      return;
    }
    this.waitingCheck = true;
    this.checkSubs = this.authService.isTypedUserAlreadyExists(this.signupForm.value.username).subscribe((userData) => {
      if (userData.user !== null) {
        this.typedUserAlreadyExists = true;
        this.waitingCheck = false;
      } else {
        this.typedUserAlreadyExists = false;
        this.waitingCheck = false;
      }
    })
  }

  onSubmit() {
    this.authService.addUser(
      this.signupForm.value.username,
      this.signupForm.value.password);

  }

  passwordsMatch() {
    return (this.signupForm.value.password === this.signupForm.value.repeatPassword);
  }

}
