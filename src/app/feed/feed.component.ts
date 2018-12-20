import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from './../models/user.model';
import { PostsService } from './../posts/posts.service';
import { Post } from 'src/app/models/post.model';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  postNum: number = 0;
  amountOfPostsToLoad = 5;
  postFetchSubs: Subscription;
  posts: Post[] = [];
  user: User;
  username: string;
  postsSubs: Subscription;
  isLoading;
  isLoadingMore = false;
  allPostsLoaded = false;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsSubs = this.postsService.getFeedPosts(this.amountOfPostsToLoad, 0)
    .subscribe((posts: any) => {
      this.isLoading = false;
      this.posts = posts;
    });
    this.user = this.authService.getActiveUserObject();
    this.username = this.authService.getActiveUser();
  }

  ngOnDestroy() {
    this.postsSubs.unsubscribe();
    this.posts = [];
    this.postNum = 0;
  }

  @HostListener('window:scroll', ['$event']) onScroll(): void {
    if(this.isLoadingMore) {
      return;
    }
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    if(pos == max )   {
      // console.log('a:' + this.postNum);
      if(this.allPostsLoaded) {
        return;
      }
      this.postNum = this.posts.length;
      this.isLoadingMore = true;
      // console.log('b:' + this.postNum);
      this.postFetchSubs = this.postsService.getFeedPosts(this.amountOfPostsToLoad, this.postNum)
      .subscribe(posts => {
        if(posts.length === 0) {
          this.allPostsLoaded = true;
        }
        let newPosts = this.posts;
        this.isLoadingMore = false;
        newPosts = newPosts.concat(posts);
        this.posts = newPosts;
      });
    }

  }



}
