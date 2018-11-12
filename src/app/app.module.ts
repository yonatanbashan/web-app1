import { AuthInterceptor } from './auth/auth-interceptor';
import { UsersService } from './users.service';
import { NewlinePipe } from './newline.pipe';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Router } from '@angular/router';
import { PostHighlightDirective } from './directives/post-highlight.directive';
import { PostsService } from './posts/posts.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PostItemComponent } from './posts/post-item/post-item.component';
import { PostsComponent } from './posts/posts.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { NewPostComponent } from './posts/new-post/new-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectionService } from './connection.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatCardModule, MatProgressSpinnerModule } from '@angular/material';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FindComponent } from './find/find.component';

@NgModule({
  declarations: [
    AppComponent,
    PostItemComponent,
    PostsComponent,
    PostHighlightDirective,
    NavigationComponent,
    HomeComponent,
    NewPostComponent,
    NewlinePipe,
    UserLoginComponent,
    UserSignupComponent,
    SpinnerComponent,
    UserProfileComponent,
    FindComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [
    PostsService,
    ConnectionService,
    UsersService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
