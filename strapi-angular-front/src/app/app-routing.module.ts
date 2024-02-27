import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FeedComponent } from './feed/feed.component';
import { NewPostComponent } from './feed/new-post/new-post.component';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: "home",component:HomeComponent},
  {path: "login",component:LoginComponent},
  {path: "signup",component:SignupComponent},
  {path: "profile/:id",component:ProfileComponent},
  {path: "profile",component:ProfileComponent},
  {path: "feed",component:FeedComponent},
  {path: "post/new",component: NewPostComponent},
  {path: "",   redirectTo: "/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
