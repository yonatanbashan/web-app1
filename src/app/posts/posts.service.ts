import { Post } from './../models/post.model';
import { AuthService } from '../auth/auth.service';
import { Comment } from '../models/comment.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionService } from '../connection.service';
import { dateFormat } from 'src/app/common';

@Injectable()
export class PostsService {

  constructor(
    private http: HttpClient,
    private connectionService: ConnectionService,
    private authService: AuthService
  ) {}

  private posts: Post[];
  private postsUpdated = new Subject<Post[]>();
  private serverAddress = this.connectionService.getServerAddress();

  mapPosts = (postData) => {
    return postData.posts.map(post => {
      return {
        title: post.title,
        content: post.content,
        creatorId: post.creator,
        formattedDate: dateFormat(new Date(post.createDate)),
        createDate: new Date(post.createDate),
        id: post._id
      };
    });
  }

  getUserPosts(username: string) {
    return this.http.get<{message: string, posts: any}>(this.serverAddress + 'api/posts/user/' + username, {})
    .pipe(map(this.mapPosts))
  }

  getPosts() {
    this.http.post<{message: string, posts: any}>(this.serverAddress + 'api/posts', {})
    .pipe(map(this.mapPosts))
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
        console.log(newPost);
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

  // Add comment to post
  addComment(content: string, post: Post) {
    const request = {
      content: content,
      postId: post.id
    };
    return this.http.post(this.serverAddress + 'api/comments', request);
  }

  mapComments = (commentData) => {
    return commentData.comments.map(comment => {
      return {
        content: comment.content,
        creatorId: comment.creatorId,
        creatorName: comment.creatorName,
        postId: comment.postId,
        formattedDate: dateFormat(new Date(comment.createDate)),
        createDate: new Date(comment.createDate),
        id: comment._id
      };
    });
  }
    // Add comment to post
  getComments(post: Post) {
    return this.http.get(this.serverAddress + 'api/comments/post/' + post.id)
    .pipe(map(this.mapComments));
  }

  deleteComment(comment: Comment, post: Post) {
    const myId = this.authService.getActiveUserId();
    // UI protection; Add also Post owner authorization to delete
    if (comment.creatorId !== myId && post.creatorId !== myId) {
      return;
    }
    return this.http.delete(this.serverAddress + 'api/comments/' + comment.id)
  }

}
