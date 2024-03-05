import { Component, OnInit, effect } from '@angular/core';
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

  constructor(private userService: UserService, private feedService: FeedService, private router: Router) {
    effect(()=>{
      if (this.userService.currUser()) {
        this.router.navigate(['/profile']);
      }
    })
  }

  userLoggedIn:boolean = false;
  ngOnInit(): void {
    
  }

  onSubmit(form: NgForm){
    var email = form.value.email;
    var password = form.value.password;
    this.userService.isPasswordCorrect(email,password).subscribe(res=>{
      if (res.jwt) {
        localStorage.setItem('jwt',res.jwt)
        this.userService.authToken.set(res.jwt);
        
        this.router.navigate(['/profile']);
      }else{
        this.errorExists = true;
        this.errorText = "Password is incorrect";
      }
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
