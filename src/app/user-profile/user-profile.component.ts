import { User } from './../models/user.model';
import { UsersService } from './../users.service';
import { PostsService } from './../posts/posts.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { sortPostsByDate } from '../common'
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  isLoading: boolean;
  username: string;
  error = null;
  posts: Post[] = [];
  user: User;
  isMe = false;

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    this.getUserPosts(this.username);
    this.usersService.getUser(this.username).subscribe(this.acclaimUser);
    this.route.params.subscribe((params) => {
      this.username = params['username'];
      this.getUserPosts(this.username);
      this.userInitialize(this.username);
      this.usersService.getUser(this.username).subscribe(this.acclaimUser);;
    });

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
      followers: response.user.followers
    };
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
