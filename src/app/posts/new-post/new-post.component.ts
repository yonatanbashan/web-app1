import { AuthService } from '../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit, OnDestroy {

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router) { }
  addPostForm: FormGroup;

  private isAuthSubs: Subscription;

  ngOnInit() {
    this.addPostForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'content': new FormControl(null, Validators.required),
    });
    this.isAuthSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      if (!isAuth) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.isAuthSubs.unsubscribe();
  }

  onSubmit() {

    this.postsService.addPost(
      this.addPostForm.value.title,
      this.addPostForm.value.content
    );
    this.addPostForm.reset();
    this.router.navigate(['/user', this.authService.getActiveUser()]);
  }

}
