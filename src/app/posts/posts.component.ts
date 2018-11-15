import { Post } from '../models/post.model';
import { PostsService } from './posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { sortPostsByDate } from '../common'

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  private isAuthSubs: Subscription;
  postsAvailable = false;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts) => {
      this.posts = posts.sort(sortPostsByDate);
      this.postsAvailable = true;
    });
    this.postsService.getPosts();

    this.isAuthSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      if (!isAuth) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.isAuthSubs.unsubscribe();
  }

}
