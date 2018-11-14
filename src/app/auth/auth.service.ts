import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { ConnectionService } from '../connection.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {


  private serverAddress = this.connectionService.getServerAddress();

  private activeUser = null;
  private activeUserId = null;
  private userExist = true;
  private typedUserAlreadyExists = false;
  private token: string;
  private tokenTimer: any;

  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient,
    private connectionService: ConnectionService,
    private router: Router) {}

  decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (err) {
      return null;
    }
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getToken() {
    return this.token;
  }

  getActiveUser() {
    return this.activeUser;
  }

  getActiveUserId() {
    return this.activeUserId;
  }

  isUserExist() {
    return this.userExist;
  }

  isTypedUserAlreadyExists(username: string) {
    if  (username === '' || username === null) {
      this.typedUserAlreadyExists = false;
      return;
    }
    const request = {
      type: 'check',
      args: {
        username: username
      }
    };
    return this.http.post<{message: string, user: any}>(this.serverAddress + 'api/users', request)
  }

  setActiveUser(username: string) {
    this.activeUser = username;
  }

  signIn(username: string, password: string) {
    const authData: AuthData = {
      username: username,
      password: password
    };
    const request = {
      type: 'login',
      args: authData
    };
    return this.http.post(this.serverAddress + 'api/users/', request)
    .subscribe((response: any) => {
      if (response.token) {
        const decodedToken = this.decodeToken(response.token);
        this.token = response.token;
        if (decodedToken) {
          const expireLength = response.expireLength;
          this.setAuthTimer(expireLength);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expireLength * 1000);
          this.saveAuthData(response.token, expirationDate);
          this.activeUser = decodedToken.username;
          this.activeUserId = decodedToken.id;
          this.authStatusListener.next(true);
          this.userExist = true;
        } else {
          this.activeUser = null;
        }
      }
    });

  }

  checkUserExists(username: string) {
    if  (username === '' || username === null) {
      this.typedUserAlreadyExists = false;
      return;
    }
    const request = {
      type: 'check',
      args: {
        username: username
      }
    };
    this.http.post<{message: string, user: any}>(this.serverAddress + 'api/users', request)
    .subscribe((userData) => {
      if (userData.user !== null) {
        this.typedUserAlreadyExists = true;
      } else {
        this.typedUserAlreadyExists = false;
      }
    });

  }

  addUser(username: string, password: string) {
    const authData: AuthData = {
      username: username,
      password: password
    };
    this.http
      .post<{message: string, token: string}>(this.serverAddress + 'api/users/add', authData)
      .subscribe((response) => {
        this.router.navigate(['/']);
        this.signIn(username, password);
      });

  }

  logout() {
    this.activeUser = null;
    this.activeUserId = null;
    this.token = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private getAuthData() {
    const token = localStorage.getItem('blogsapp-token');
    const expirationDate = localStorage.getItem('blogsapp-expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('blogsapp-token', token);
    localStorage.setItem('blogsapp-expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('blogsapp-token');
    localStorage.removeItem('blogsapp-expiration');
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      const decodedToken = this.decodeToken(this.token);
      this.activeUser = decodedToken.username;
      this.activeUserId = decodedToken.id;
      this.userExist = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

}
