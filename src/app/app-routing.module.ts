import { UserEditComponent } from './user/user-edit/user-edit.component';
import { FindComponent } from './find/find.component';
import { AuthGuard } from './auth/auth.guard';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPostComponent } from './posts/new-post/new-post.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';


const appRoutes: Routes = [
  { path: 'new-post', component: NewPostComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: UserSignupComponent },
  { path: 'find', component: FindComponent, canActivate: [AuthGuard] },
  { path: 'user-edit', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'user/:username', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
