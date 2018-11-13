import { User } from './models/user.model';
import { ConnectionService } from './connection.service';
import { AuthService } from './auth/auth.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient,
    private connectionService: ConnectionService,
    private authService: AuthService
  ) {}

  private serverAddress = this.connectionService.getServerAddress();

  mapUsers = (userData) => {
    return userData.users.map(user => {
      const newUser: User = {
        username: user.username,
        id: user._id,
        followers: user.followers
      }
      return newUser;
    });
  }

  getUsers(name: string) {
    const request = {
      searchBy: 'name',
      searchName: name
    }
    return this.http.post(this.serverAddress + 'api/users/find/', request)
    .pipe(map(this.mapUsers))
  }

  followUser(targetUsername: string) {
    const request = {
      type: 'follow'
    }
    return this.http.put<{message: string, posts: any}>(this.serverAddress + 'api/users/' + targetUsername, request)
  }

  unfollowUser(targetUsername: string) {
    const request = {
      type: 'unfollow'
    }
    return this.http.put<{message: string, posts: any}>(this.serverAddress + 'api/users/' + targetUsername, request)
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

}
