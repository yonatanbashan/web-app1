import { UsersService } from 'src/app/users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { sortUsersByName } from 'src/app/common/'

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private router: Router) { }
  followedUsers: User[];

  ngOnInit() {
    this.usersService.getFollowedUsers()
    .subscribe((users) => {
      this.followedUsers = users.sort(sortUsersByName);
    });
  }

  onNewPost() {
    this.router.navigate(['/new-post']);
  }

  onEditProfile() {
    this.router.navigate(['/user-edit']);
  }

}
