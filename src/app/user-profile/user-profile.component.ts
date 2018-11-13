import { User } from './../models/user.model';
import { UsersService } from './../users.service';
import { PostsService } from './../posts/posts.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private route: ActivatedRoute
  ) { }

  isLoading: boolean;
  username: string;
  error = null;
  posts: Post[] = [];
  user: User;

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    this.getUserPosts(this.username);
    this.usersService.getUser(this.username).subscribe(this.acclaimUser);
    this.route.params.subscribe((params) => {
      this.username = params['username'];
      this.getUserPosts(this.username);
      this.usersService.getUser(this.username).subscribe(this.acclaimUser);;
    });

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
        this.posts = posts;
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
