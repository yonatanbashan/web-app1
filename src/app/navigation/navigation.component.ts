import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  constructor(protected authService: AuthService,
    private router: Router) { }

  activeUser: string = null;
  private isAuthSubs: Subscription;

  ngOnInit() {
    this.activeUser = this.authService.getActiveUser();
    this.isAuthSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.activeUser = this.authService.getActiveUser();
    });
    this.authService.autoAuthUser();
  }

  ngOnDestroy() {
    this.isAuthSubs.unsubscribe();
  }

  getActiveUser() {
    return this.activeUser;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
