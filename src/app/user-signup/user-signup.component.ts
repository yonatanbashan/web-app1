import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  typedUserAlreadyExists = false;

  constructor(private authService: AuthService) { }

  signupForm: FormGroup;

  ngOnInit() {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.minLength(6)),
    });
  }

  checkTypedUserAlreadyExists() {
    return this.authService.isTypedUserAlreadyExists();
  }

  onSubmit() {
    this.authService.addUser(
      this.signupForm.value.username,
      this.signupForm.value.password);

  }

  onCheck(username: string) {
    this.authService.checkUserExists(this.signupForm.value.username);
  }


}
