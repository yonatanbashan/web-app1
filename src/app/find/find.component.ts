import { CommunicationService } from './../communication.service';
import { AuthService } from './../auth/auth.service';
import { User } from './../models/user.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css']
})
export class FindComponent implements OnInit, OnDestroy {


  @ViewChild('findInput') findInput: ElementRef;

  constructor(
    protected usersService: UsersService,
    private authService: AuthService,
    private commService: CommunicationService
  ) { }

  users: User[] = [];
  isLoading: boolean;
  searchSubs: Subscription;
  pending: boolean[] = [];
  searchEventSubs: Subscription;

  ngOnInit() {
    this.searchEventSubs = this.commService.getSearchActionSubj().subscribe(
      searchString => {
        this.onSearchEvent(searchString);
      }
    );
    const lastSearch = this.commService.getLastSearch();
    if (lastSearch) {
      this.onSearchEvent(lastSearch);
    }
  }

  ngOnDestroy() {
    this.searchEventSubs.unsubscribe();
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

  onSearchEvent(searchString: string) {
    if (this.searchSubs) {
      this.searchSubs.unsubscribe(); // Remove old subscriptions which didn't execute yet, since a new letter was typed
    }
    if (searchString === '') {
      this.isLoading = false;
      this.users = [];
      return;
    }
    this.isLoading = true;
    const searchName = searchString;
    this.searchSubs = this.usersService.getUsers(searchName)
    .subscribe((response) => {
      this.updateUsers(response);
    });
  }

  followUser(user: User, index: number) {
    this.pending[index] = true;
    this.usersService.followUser(user.id)
    .subscribe(() => {
      this.users[index].followers.push(this.authService.getActiveUserId());
      this.pending[index] = false;
    })
  }

  unfollowUser(user: User, index: number) {
    this.pending[index] = true;
    this.usersService.unfollowUser(user.id)
    .subscribe(() => {
      this.users[index].followers.splice(this.users[index].followers.indexOf(this.authService.getActiveUserId()), 1);
      this.pending[index] = false;
    })
  }

}
