import { AuthService } from '../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input() post: Post;
  fullDisplay = false;
  comments: Comment[] = [];
  isLoadingComments: false;
  @ViewChild('commentInput') commentInput: ElementRef;

  constructor(
    private postsService: PostsService,
    private authService: AuthService) { }

  ngOnInit() {
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

  addComment() {
    this.postsService.addComment(this.commentInput.nativeElement.value, this.post)
    .subscribe(() => {
      this.updateComments();
    });
    this.commentInput.nativeElement.value = '';
  }

  updateComments() {
    this.postsService.getComments(this.post)
    .subscribe((comments) => {
      this.comments = comments;
    })
  }

  deleteComment(comment: Comment) {
    const deleteAttempt = this.postsService.deleteComment(comment)
    if (deleteAttempt) { // Make sure it was not rejected by pre-checks
      deleteAttempt.subscribe(() => {
        this.updateComments();
      })
    }

  }


}
