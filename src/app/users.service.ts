import { IRequest } from './common/irequest';
import { User } from './models/user.model';
import { ConnectionService } from './connection.service';
import { AuthService } from './auth/auth.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient,
    private connectionService: ConnectionService,
    private authService: AuthService,
    private router: Router
  ) {}

  private serverAddress = this.connectionService.getServerAddress();

  mapUsers = (userData) => {
    return userData.users.map(user => {
      const newUser: User = {
        username: user.username,
        id: user._id,
        followers: user.followers,
        userInfo: user.userInfo
      }
      return newUser;
    });
  }

  getUser(username: string) {
    const params = `username=${username}`;
    return this.http.get(this.serverAddress + 'api/users/get/?' + params);
  }

  getUserById(id: string) {
    const params = `id=${id}`;
    return this.http.get(this.serverAddress + 'api/users/get/?' + params);
  }

  getUsers(name: string) {
    const request = {
      searchBy: 'name',
      searchName: name
    }
    return this.http.post(this.serverAddress + 'api/users/find/', request)
    .pipe(map(this.mapUsers));
  }

  followUser(userId: string) {
    const request = {
      type: 'follow'
    }
    return this.http.put<{message: string, posts: any}>(this.serverAddress + 'api/users/' + userId, request);
  }

  unfollowUser(userId: string) {
    const request = {
      type: 'unfollow'
    }
    return this.http.put<{message: string, posts: any}>(this.serverAddress + 'api/users/' + userId, request);
  }

  // Checks whether a given user is followed by current user
  isFollowed(user: User) {
    const userId = this.authService.getActiveUserId();
    if (user.followers.includes(userId)) {
      return true;
    }
    return false;
  }

  isMe(user: User) {
    return user.id === this.authService.getActiveUserId();
  }

  getFollowedUsers() {
    return this.http.get<{message: string, users: User[]}>(this.serverAddress + 'api/users/followed/')
    .pipe(map(this.mapUsers));
  }

  getUserInfo(username: string) {
    const params = `?username=${username}`;
    return this.http.get<{ message: string, userInfo: any}>(this.serverAddress + 'api/users/info/' + params);
  }

  updateUserInfo(info: any, image: File = null) {

    let imageData: FormData;
    if(image !== null) {
      imageData = new FormData();
      imageData.append("image", image);
    }

    const request = {
      headerText: info.headerText,
      hideDate: info.hideDate,
      birthDate: info.birthDate,
      image: imageData
    };

    return this.http.put(this.serverAddress + 'api/users/info/', request)
    .subscribe(responseData => {
      this.router.navigate(['/user', this.authService.getActiveUser()]);
    });
  }

  // Admin utilities

  pingRequest(request: IRequest) {
    this.http.post(this.serverAddress + 'api/users/admin/', request)
    .subscribe(response => {
      console.log(response);
    })
  }

}
