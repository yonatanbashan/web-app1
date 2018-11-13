import { AuthService } from './../auth/auth.service';
import { User } from './../models/user.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css']
})
export class FindComponent implements OnInit {


  @ViewChild('findInput') findInput: ElementRef;

  constructor(
    protected usersService: UsersService,
    private authService: AuthService
  ) { }

  users: User[] = [];
  isLoading: boolean;
  searchSubs: Subscription;
  pending: boolean[] = [];

  ngOnInit() {
  }

  updateUsers(users) {
    for (let i = 0; i < users.length; i++) {
      this.pending.push(false);
    }
    this.users = users;
    this.users.sort((a: User, b: User) => {
      if (a.username < b.username) {
        return -1;
      } else {
        return 1;
      }
    });
    this.isLoading = false;
  }

  onFindInput() {
    if (this.searchSubs) {
      this.searchSubs.unsubscribe(); // Remove old subscriptions which didn't execute yet, since a new letter was typed
    }
    if (this.findInput.nativeElement.value === '') {
      this.isLoading = false;
      this.users = [];
      return;
    }
    this.isLoading = true;
    const searchName = this.findInput.nativeElement.value;
    this.searchSubs = this.usersService.getUsers(searchName)
    .subscribe((response) => {
      this.updateUsers(response);
    });
  }

  followUser(user: User, index: number) {
    this.pending[index] = true;
    this.usersService.followUser(user.username)
    .subscribe(() => {
      this.users[index].followers.push(this.authService.getActiveUserId());
      this.pending[index] = false;
      console.log(this.users);
    })
  }

  unfollowUser(user: User, index: number) {
    this.pending[index] = true;
    this.usersService.unfollowUser(user.username)
    .subscribe(() => {
      this.users[index].followers.splice(this.users[index].followers.indexOf(this.authService.getActiveUserId()), 1);
      this.pending[index] = false;
      console.log(this.users);
    })
  }

}
