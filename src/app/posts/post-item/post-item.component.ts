import { UsersService } from './../../users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from './../../models/user.model';
import { AuthService } from '../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit, OnChanges {

  @Input() post: Post;
  @Input() userId: string;
  user: User;
  fullDisplay = false;
  comments: Comment[] = [];
  isLoadingComments = false;
  authorText = '';
  @ViewChild('commentInput') commentInput: ElementRef;

  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
    private authService: AuthService) { }
    commentForm: FormGroup;


  ngOnInit() {
    this.commentForm = new FormGroup({
      'content': new FormControl(null, Validators.required),
    });
    this.usersService.getUserById(this.userId).subscribe(this.acclaimUser);
  }

  ngOnChanges() {
    this.usersService.getUserById(this.userId).subscribe(this.acclaimUser);
  }

  acclaimUser = (response: any) => {
    this.user = response.user;
    this.user.id = response.user._id;
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
    this.fullDisplay = !this.fullDisplay;
    if (this.fullDisplay) {
      this.updateComments();
    }
  }

  addComment(comment: string) {
    this.postsService.addComment(comment, this.post)
    .subscribe(() => {
      this.updateComments();
    });
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
    }
    return (this.post.creatorId === myId || this.user.followers.includes(myId));
  }


}
