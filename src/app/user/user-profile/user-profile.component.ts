import { PhotoViewComponent } from './../../photo-view/photo-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/users.service';
import { PostsService } from 'src/app/posts/posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { sortPostsByDate } from 'src/app/common'
import { AuthService } from 'src/app/auth/auth.service';
import { dateFormat } from 'src/app/common';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private authService: AuthService,
    private notifyService: NotificationService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  isLoading: boolean;

  // General
  username: string;
  error = null;
  posts: Post[] = [];
  user: User;
  isMe = false;
  postsListenerSubs: Subscription;
  notifySubs: Subscription;

  // UserInfo-related
  isLoadingInfo: boolean = false;
  isLoadingUser: boolean = true;
  userInfo: any = {
    profileImagePath: environment.s3address + environment.defaultProfileImage
  };
  birthDayText: string = '';
  hideDate: boolean = true;
  headerText: string ='';
  showInfo: boolean = false;

  pendingFollow: boolean;
  isFollowed: boolean;
  notifyNum: number = 0;

  ngOnInit() {

    this.notifySubs = this.notifyService.getNotificationSubject().subscribe(notifications => {
      this.notifyNum = notifications.filter(n => !n.read).length;
    });

    // Listen to changes from the posts service subject
    this.notifyService.updateNotifications();
    this.postsListenerSubs = this.postsService.getPostUpdateListener()
    .subscribe(posts => {
      this.posts = posts.sort(sortPostsByDate);
    });

    this.route.params.subscribe((params) => {
      this.notifyService.updateNotifications();
      this.isLoadingUser = true;
      this.userInfo = {};
      this.username = params['username'];
      this.getUserPosts(this.username);
      this.userInitialize(this.username);
      this.usersService.getUser(this.username).subscribe(this.acclaimUser);
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

  ngOnDestroy() {
    this.postsListenerSubs.unsubscribe();
    this.notifySubs.unsubscribe();
  }

  followUser() {
    this.pendingFollow = true;
    this.usersService.followUser(this.user.id)
    .subscribe(() => {
      const myUsername = this.authService.getActiveUser();
      this.notifyService.addNotification(
        `#${myUsername} is now following you!`,
        'follow',
        myUsername,
        this.user.id,
      );
      this.isFollowed = !this.isFollowed;
      this.pendingFollow = false;
    })
  }

  unfollowUser() {
    this.pendingFollow = true;
    this.usersService.unfollowUser(this.user.id)
    .subscribe(() => {
      this.isFollowed = !this.isFollowed;
      this.pendingFollow = false;
    })
  }

  photoViewOpen(profileImagePath) {
    let dialogRef = this.dialog.open(PhotoViewComponent, {
      data: { imagePath: profileImagePath },
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

    if(!this.userInfo.profileImagePath || this.userInfo.profileImagePath === "null") {
      this.userInfo.profileImagePath = environment.s3address + environment.defaultProfileImage
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

    this.isLoadingUser = false;
    if(this.user.followers.includes(this.authService.getActiveUserId())) {
      this.isFollowed = true;
    } else {
      this.isFollowed = false;
    }

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
