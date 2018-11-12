import { UsersService } from './../../users.service';
import { PostsService } from './../posts.service';
import { NewlinePipe } from './../../newline.pipe';
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
    private usersService: UsersService) { }

  ngOnInit() {
  }

  onDelete(postId) {
    this.postsService.deletePost(postId);
  }

  getActiveUserId() {
    return this.usersService.getActiveUserId();
  }


}
