import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedService } from 'src/app/service/feed.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorExists = false;
  errorText = "";

  constructor(private userService: UserService, private feedService: FeedService, private router: Router) { }

  userLoggedIn:boolean = false;
  ngOnInit(): void {
    // this.userService.sharedLoggedin.subscribe(message => {this.userLoggedIn = message; })
  }

  onSubmit(form: NgForm){
    var email = form.value.email;
    var password = form.value.password;
    this.userService.isPasswordCorrect(email,password).subscribe(res=>{
      if (res.jwt) {
        this.userService.getUserApi(res.user.id).subscribe(s=>{
          this.userService.currUser.set(s);
          this.router.navigate(['/profile']);
        })
      }else{
        this.errorExists = true;
        this.errorText = "Password is incorrect";
      }
      
      /* if (res.length == 0) {
        this.errorExists = true;
        this.errorText = "Password is incorrect";
      }else{
        this.userService.currUser.set(res[0]);
        this.router.navigate(['/profile']);
      } */
    });
    
    
    /* if(user==undefined) {
      this.errorExists = true;
      this.errorText = "There is no registered user with username " + email;
      return;
    }
    var isPasswordValid = this.userService.isPasswordCorrect(email, password); */
    /* if(!isPasswordValid) {
      this.errorExists = true;
      this.errorText = "Password is incorrect";
      return;
    } */
    /* this.errorExists = false;
    this.userService.setCurrentUser(user);
    this.router.navigate(['/profile']); */
  }
}
