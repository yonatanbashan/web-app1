import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from './../models/user.model';
import { PostsService } from './../posts/posts.service';
import { Post } from 'src/app/models/post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  posts: Post[];
  user: User;
  postsSubs: Subscription;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postsSubs = this.postsService.getFeedPosts(5)
    .subscribe((posts: any) => {
      this.posts = posts;
    });
    this.user = this.authService.getActiveUserObject();
  }

  ngOnDestroy() {
    this.postsSubs.unsubscribe();
  }

}
