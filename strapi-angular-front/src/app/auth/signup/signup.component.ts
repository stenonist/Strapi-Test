import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedService } from 'src/app/service/feed.service';
import { UploadService } from 'src/app/service/upload.service';
import { User } from 'src/app/service/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  // locations = ["Zemun","Novi Beograd","Galenika","Dorcol","Savamala","Senjak","Banovo Brdo"];
  selectedLocation:string="";
  errorExists = false;
  errorText = "";

  users: User[] =[];
  theFile: any = null; 

  constructor(private uploadService: UploadService, private userService: UserService,private router : Router) {
    // this.userService.sharedUsers.subscribe(message => {this.users = message; })
  }

  isImageSaved: boolean = false;
  cardImageBase64: string = '';

  ngOnInit(): void {
    
  }

  onChange(event:any) {
    this.theFile = event.target.files[0];
  }

  onSubmit(form: NgForm){
    if(this.userService.getUserByMail(form.value.email)){
      this.errorText = 'User with this email already exists';
    } else {
      this.errorExists = false;
      let fData = form.value;
      fData.tags=[];
      fData.following=[];
      fData.followers=[];
      console.log(fData);

      const formData = new FormData();
      formData.append("files", this.theFile);

      this.uploadService.uploadImageApi(formData).subscribe(r=>{
        let theImage = r[0];
        console.log(theImage);

        this.userService.addUserApi({
            username: fData.username,
            email: fData.email,
            password: fData.password,
            firstname: fData.firstname,
            lastname: fData.lastname,
            profilePic: theImage,
            tags: fData.tags,
            followers: fData.followers,
            following: fData.following
        })
        .subscribe(res=>{
          this.userService.getUserApi(res.user.id).subscribe(u=>{
            this.userService.currUser.set(u);
            this.router.navigate(['/profile']);
          });

        })
      })
      
    }
  }

}
