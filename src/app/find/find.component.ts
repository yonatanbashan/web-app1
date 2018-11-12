import { UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css']
})
export class FindComponent implements OnInit {

  constructor(
    private usersService: UsersService
  ) { }

  users: string[] = [];
  isLoading: boolean;

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers()
    .subscribe((response) => {
      this.users = response;
      this.users.sort();
      this.isLoading = false;
    });
  }

}
