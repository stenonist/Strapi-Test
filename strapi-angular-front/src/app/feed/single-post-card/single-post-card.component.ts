import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/service/post';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-single-post-card',
  templateUrl: './single-post-card.component.html',
  styleUrls: ['./single-post-card.component.css']
})
export class SinglePostCardComponent implements OnInit {

  constructor(private userService: UserService) { }
  userName: string|undefined = "";
  ngOnInit(): void {
    if (this.post) {
      /* this.userName = this.userService.getUserById(this.post?.authorId)?.firstname;
      if (this.userName) {
        this.userName = this.userName + " " + this.userService.getUserById(this.post?.authorId)?.lastname;
      } */
    }
    
  }

  @Input() post: Post | null = null;
  @Output() edit = new EventEmitter<Post>();

}
