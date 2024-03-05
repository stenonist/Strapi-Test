import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedService } from 'src/app/service/feed.service';
import { StrapiResponseUser } from 'src/app/service/strapi-types';
import { User } from 'src/app/service/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedUser: User|null = null;
  currentUser: User|null = this.userService.currUser();
  // currentUser: null = null;
  isUserLoggedIn: boolean = false;

  isFollowing: boolean = false;
  allUsers: User[] = [];
  isCurrentPage:boolean = true;
  route:number = -1;
  userPosts:any;

  constructor(private userService: UserService,private feedService: FeedService, private router: Router,  private activatedRoute: ActivatedRoute) {
    effect(() => {
        this.currentUser = this.userService.currUser();
        if (this.route) {

        }else{
          this.selectedUser = this.currentUser;
        }
    });
    
    
  }
  

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(parameter => {
      this.route = parameter['id'];
    })
    if(this.currentUser){
      
      if (this.route) {
        this.userService.getUserApi(this.route).subscribe((u)=>{
          this.selectedUser = u as User;
        })
        
        this.isCurrentPage = false;
        // this.isFollowing = this.userService.isFollowing(this.route);
      }else{
        this.selectedUser = this.currentUser;
        
      }
      if (this.selectedUser) {
        this.feedService.getPostCount(this.selectedUser.id).subscribe(r=>{
          this.userPosts = r.data.length;
        });
      }
    }else{
      this.selectedUser = this.currentUser;
      
      this.router.navigate(['/login']);
    }
  }

  followUser(id: number) {
    this.userService.followUser(id);
    
    //this.feedService.nextPostsUpdate();
  }
  unfollowUser(id: number) {
      this.userService.unfollowUser(id);
      
      //this.feedService.nextPostsUpdate();
  }

}
