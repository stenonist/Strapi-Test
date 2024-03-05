import { Component, effect, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { NewPostComponent, PostDialogResult } from '../feed/new-post/new-post.component';
import { FeedService } from '../service/feed.service';
import { Post } from '../service/post';
import { User } from '../service/user';
import { UserService } from '../service/user.service';
import { UploadService } from '../service/upload.service';
// import { StrapiResponsePost } from '../service/strapi-types';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	userLoggedIn:boolean = false;
	currUser: User|null = this.userService.currUser();
	posts: Post[] = this.feedService.posts();
	currRouter: string|null= null;
	

	constructor(private router: Router,private uploadService: UploadService, private userService: UserService, private feedService: FeedService, private dialog: MatDialog) { 
		this.currRouter = this.router.url;

		effect(() => {
			this.currUser = this.userService.currUser();
		});
		/* CHECK LOCAL STORAGE FOR LOGGED IN USER */

		// this.userService.sharedLoggedin.subscribe(message => {this.userLoggedIn = message; this.loggedInUser = this.userService.getCurrUser();})
	}

	ngOnInit(): void {
	}

	logout(){
		this.userService.logout();
	}
	addPost(): void {
        const dialogRefNew = this.dialog.open(NewPostComponent, {
            width: '400px',
            data: {
                title: "",
                description: "",
                photoFile: null
            },
        });
        dialogRefNew
            .afterClosed()
            .subscribe((result: PostDialogResult | undefined) => {
                if (!result) {
                    return;
                }

                if (
                    result.title &&
                    result.description
                ) {
                    // result.post.authorId = this.userService.getCurrentId();
                    // result.post.attributes.date = new Date();
                    // result.post.attributes.tags = [];
                    console.log(result.photoFile);
                    
                    const formData = new FormData();
                    formData.append("files", result.photoFile);
                    
                    
                    this.uploadService.uploadImageApi(formData).subscribe(
                        r => {
                            let theImage = r[0];
                            if (this.currUser) {
                                this.feedService.addPostApi({data:{title:result.title,description:result.description,photo:theImage,date:Date.now(),author:{connect:[this.currUser?.id]},authorId:this.currUser?.id}}).subscribe(e=>{
                                    // this.feedService.getAllPostApi().subscribe({});
                                });
                            }
                        }
                    )
                    // this.feedService.addPostApi({data:{title:result.title,description:result.description}}).subscribe(e=>{
                    //     console.log(e);
                    // });
                    //this.feedService.addPost(result.post)
                }else{

                }
            });
    }
}
