import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { FeedComponent } from './feed/feed.component';

/* Services */
import { FeedService } from './service/feed.service';
import { UserService } from './service/user.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MatIconModule } from '@angular/material/icon';
import { NewPostComponent } from './feed/new-post/new-post.component';
import { HttpClientModule } from '@angular/common/http';
import { SinglePostCardComponent } from './feed/single-post-card/single-post-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    FeedComponent,
    HeaderComponent,
    FooterComponent,
    NewPostComponent,
    SinglePostCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [FeedService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
