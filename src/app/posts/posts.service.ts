import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { Post } from './models/post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionService } from '../connection.service';

@Injectable()
export class PostsService {

  constructor(
    private http: HttpClient,
    private connectionService: ConnectionService,
    private usersService: UsersService,
    private router: Router
  ) {}

  private posts: Post[];
  private postsUpdated = new Subject<Post[]>();
  private serverAddress = this.connectionService.getServerAddress();


  getPosts() {
    this.http.post<{message: string, posts: any}>(this.serverAddress + 'api/posts', {})
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          user: post.user,
          id: post._id
        };
      });
    }))
    .subscribe((posts) => {
      this.posts = posts;
      this.postsUpdated.next(this.posts);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const request = {
      title: title,
      content: content
    };
    this.http
      .post<{message: string, postId: string}>(this.serverAddress + 'api/posts/new', request)
      .subscribe((responseData) => {
        const id = responseData.postId;
        const newPost = new Post(title, content, id);
        this.posts.push(newPost);
        this.postsUpdated.next([...this.posts]);
        this.getPosts();
      });

  }

  sortPosts() {
    // TODO: Enable
    // this.posts.sort((a, b) => {
    //   if (a.title > b.title) {
    //     return -1;
    //   } else {
    //     return 1;
    //   }
    // });
  }

  deletePost(postId) {
    this.http.delete(this.serverAddress + 'api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

}
