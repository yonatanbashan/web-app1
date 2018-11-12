import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  constructor(private usersService: UsersService,
    private router: Router) { }

  activeUser: string = null;
  private isAuthSubs: Subscription;

  ngOnInit() {
    this.activeUser = this.usersService.getActiveUser();
    this.isAuthSubs = this.usersService.getAuthStatusListener().subscribe(isAuth => {
      this.activeUser = this.usersService.getActiveUser();
    });
    this.usersService.autoAuthUser();
  }

  ngOnDestroy() {
    this.isAuthSubs.unsubscribe();
  }

  getActiveUser() {
    return this.activeUser;
  }

  logout() {
    this.usersService.logout();
    this.router.navigate(['/']);
  }

}
