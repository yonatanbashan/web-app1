import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthService } from './auth/auth.service';
import { NewlinePipe } from './newline.pipe';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Router } from '@angular/router';
import { PostsService } from './posts/posts.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppComponent } from './app.component';
import { PostItemComponent } from './posts/post-item/post-item.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { NewPostComponent } from './posts/new-post/new-post.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConnectionService } from './connection.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule, MatProgressSpinnerModule, MatNativeDateModule, MatIconModule, MatCheckboxModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';

import { SpinnerComponent } from './common/spinner/spinner.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { FindComponent } from './find/find.component';
import { UsersService } from './users.service';
import { ActionBarComponent } from './user/user-profile/action-bar/action-bar.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { FeedComponent } from './feed/feed.component';
import { PhotoViewComponent } from './photo-view/photo-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PostItemComponent,
    NavigationComponent,
    HomeComponent,
    NewPostComponent,
    NewlinePipe,
    UserLoginComponent,
    UserSignupComponent,
    SpinnerComponent,
    UserProfileComponent,
    FindComponent,
    ActionBarComponent,
    UserEditComponent,
    FeedComponent,
    PhotoViewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [
    PostsService,
    ConnectionService,
    AuthService,
    UsersService,
    MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
    entryComponents: [
      PhotoViewComponent
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
