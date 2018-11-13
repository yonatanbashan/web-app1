import { AuthService } from '../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Post } from './../models/post.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input() post: Post;

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


}
