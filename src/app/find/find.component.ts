import { Subscription } from 'rxjs';
import { UsersService } from './../users.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css']
})
export class FindComponent implements OnInit {


  @ViewChild('findInput') findInput: ElementRef;

  constructor(
    private usersService: UsersService
  ) { }

  users: string[] = [];
  isLoading: boolean;
  searchSubs: Subscription;

  ngOnInit() {
  }

  updateUsers(users) {
    this.users = users;
    this.users.sort();
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

}
