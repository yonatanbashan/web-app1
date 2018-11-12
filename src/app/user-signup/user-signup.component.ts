import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  typedUserAlreadyExists = false;

  constructor(private usersService: UsersService,
    private router: Router) { }
    signupForm: FormGroup;

  ngOnInit() {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.minLength(6)),
    });
  }

  checkTypedUserAlreadyExists() {
    return this.usersService.isTypedUserAlreadyExists();
  }

  onSubmit() {
    this.usersService.addUser(
      this.signupForm.value.username,
      this.signupForm.value.password);
    this.router.navigate(['/']);
  }

  onCheck(username: string) {
    this.usersService.checkUserExists(this.signupForm.value.username);
  }


}
