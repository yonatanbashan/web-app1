import { UsersService } from './../../users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from './../../models/user.model';
import { AuthService } from '../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css'],
  animations: [
    trigger('postItemTrigger', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0%) scaleY(1)'
      })),
      transition('void => *', [
        style({
          opacity: 1,
          transform: 'translateY(-30%) scaleY(1)'
        }),
        animate(200)
      ]),
    ])
  ]
})
export class PostItemComponent implements OnInit {

  faTrashAlt = faTrashAlt;

  @Input() post: Post;
  @Input() userId: string;
  user: User;
  userInfo: any = {
    profileImagePath: environment.s3address + environment.defaultProfileImage
  };
  @Input() fullDisplay;
  @Input() toggleDisabled = false;
  comments: Comment[] = [];
  isLoadingComments = false;
  authorText = '';
  @ViewChild('commentInput') commentInput: ElementRef;

  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
    private authService: AuthService,
    private notifyService: NotificationService,
    ) { }
    commentForm: FormGroup;


  ngOnInit() {
    this.user = new User();
    this.user.followers = []; // To avoid accessing null from HTML before initializing user
    if (this.fullDisplay) {
      this.updateComments();
    }
    this.commentForm = new FormGroup({
      'content': new FormControl(null, Validators.required),
    });
    this.authorText = '';
    this.usersService.getUserById(this.userId).subscribe(this.acclaimUser);
    this.updateComments();
  }

  acclaimUser = (response: any) => {
    this.user = response.user;
    this.user.id = response.user._id;
    this.userInfo = this.user.userInfo;
    if (!this.userInfo.profileImagePath || this.userInfo.profileImagePath === "null") {
      this.userInfo.profileImagePath = environment.s3address + environment.defaultProfileImage
    }
    this.authorText = ', by ' + this.user.username;
  }

  onSubmitComment() {
    this.addComment(this.commentForm.value.content);
    this.commentForm.reset();
  }

  onDelete(postId) {
    this.postsService.deletePost(postId);
  }

  getActiveUserId() {
    return this.authService.getActiveUserId();
  }

  toggleDisplay() {
    if (this.toggleDisabled) {
      return;
    }
    if (this.fullDisplay) {
      this.updateComments();
    }
    this.fullDisplay = !this.fullDisplay;
  }

  addComment(comment: string) {
    this.postsService.addComment(comment, this.post)
    .subscribe(() => {
      this.updateComments();
      this.sendCommentNotification(comment);
    });
  }

  sendCommentNotification(text: string) {
    const maxStringLength = 25;
    let shortText;
    if(text.length > maxStringLength) {
      shortText = text.substring(0, maxStringLength) + '...';
    } else {
      shortText = text;
    }
    const myUsername = this.authService.getActiveUser();
    const notificationText = `#${myUsername} commented on your post '${this.post.title}': ${shortText}`;
    this.notifyService.addNotification(
      notificationText,
      'comment',
      this.post.id,
      this.post.creatorId
    );
  }

  updateComments() {
    this.isLoadingComments = true;
    this.postsService.getComments(this.post)
    .subscribe((comments) => {
      this.isLoadingComments = false;
      this.comments = comments;
    })
  }

  deleteComment(comment: Comment) {
    this.isLoadingComments = true;
    const deleteAttempt = this.postsService.deleteComment(comment, this.post)
    if (deleteAttempt) { // Make sure it was not rejected by pre-checks
      deleteAttempt.subscribe(() => {
        this.updateComments();
      })
    } else {
      this.isLoadingComments = false;
    }

  }

  canComment() {
    const myId = this.getActiveUserId();
    if (this.user === null) {
      return false;
    } else {
      return (this.post.creatorId === myId || this.user.followers.includes(myId));
    }
  }



}
