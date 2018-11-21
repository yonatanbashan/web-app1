import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/users.service';
import { PostsService } from 'src/app/posts/posts.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { sortPostsByDate } from 'src/app/common'
import { AuthService } from 'src/app/auth/auth.service';
import { dateFormat } from 'src/app/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  isLoading: boolean;

  // General
  username: string;
  error = null;
  posts: Post[] = [];
  user: User;
  isMe = false;

  // UserInfo-related
  isLoadingInfo: boolean = false;
  userInfo: any = {};
  birthDayText: string = '';
  hideDate: boolean = true;
  headerText: string ='';
  showInfo: boolean = false;

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    this.getUserPosts(this.username);
    this.usersService.getUser(this.username).subscribe(this.acclaimUser);
    this.route.params.subscribe((params) => {
      this.userInfo = {};
      this.username = params['username'];
      this.getUserPosts(this.username);
      this.userInitialize(this.username);
      this.usersService.getUser(this.username).subscribe(this.acclaimUser);;
      this.isLoadingInfo = true;
      this.usersService.getUserInfo(this.username)
      .subscribe((response) => {
        this.hideDate = true;
        this.userInfo = response.userInfo;
        this.prepareUserInfo();
        this.isLoadingInfo = false;
      });
    });

    this.isLoadingInfo = true;
    this.usersService.getUserInfo(this.username)
    .subscribe((response) => {
      this.userInfo = response.userInfo;
      this.hideDate = true;
      this.prepareUserInfo();
      this.isLoadingInfo = false;
    });

  }


  private prepareUserInfo() {
    if (this.userInfo.birthDate) {
      this.birthDayText = dateFormat(new Date(this.userInfo.birthDate), {dateOnly: true});
      if (this.userInfo.hideDate !== undefined || this.userInfo.hideDate !== null) {
        this.hideDate = this.userInfo.hideDate;
      }
    } else {
      this.hideDate = true;
    }

    this.headerText = this.userInfo.headerText;
  }


  private userInitialize(username: string) {
    if (username === this.authService.getActiveUser()) {
      this.isMe = true;
    } else {
      this.isMe = false;
    }
  }

  private acclaimUser = (response) => {
    this.user = {
      username: response.user.username,
      id: response.user._id,
      followers: response.user.followers,
      userInfo: {}
    };
  }

  private getUserPosts(username: string) {
    this.isLoading = true;
    this.postsService.getUserPosts(username)
    .subscribe((posts) => {
      if (posts) {
        this.posts = posts.sort(sortPostsByDate);
      }
      this.isLoading = false;
      this.error = null;
    },
    (error) => {
      this.isLoading = false;
      this.username = null;
      this.error = error.error.message;
    });
  }

}