import { Component, effect, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedService } from '../service/feed.service';
import { Post } from '../service/post';
import { User } from '../service/user';
import { UserService } from '../service/user.service';
import {
    NewPostComponent,
    PostDialogResult,
} from './new-post/new-post.component';
import { toArray } from 'rxjs';
import { UploadService } from '../service/upload.service';

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
    posts: Post[]|null = null;
    // followingPosts: Post[]|null = this.feedService.followingPosts();
    users: User[] = this.userService.allUsers();
    currUser: User | null = this.userService.currUser();
    hasPosts: boolean = false;

    constructor(
        private uploadService: UploadService,
        private userService: UserService,
        private feedService: FeedService,
        private dialog: MatDialog
    ) {
        effect(() => {
            this.currUser = this.userService.currUser();
            this.users = this.userService.allUsers();
            this.posts = this.feedService.posts();

            if (this.posts) {
                this.hasPosts = true;
            }
        });
    }

    ngOnInit(): void {
        
    }

    addPost(): void {
        const dialogRefNew = this.dialog.open(NewPostComponent, {
            width: '400px',
            data: {
                title: "",
                description: "",
                photo: File,
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
                    result.description &&
                    this.currUser
                ) {
                    // result.authorId = this.currUser.id;
                    // result.date = new Date();
                    // result.tags = [];
                    const formData = new FormData();
                    formData.append("files", result.photoFile);
                    
                    
                    this.uploadService.uploadImageApi(formData).subscribe(
                        r => {
                            let theImage = r[0];
                            if (this.currUser){
                                this.feedService.addPostApi({data:{title:result.title,description:result.description,date:Date.now(),photo:theImage,author:{connect:[this.currUser?.id]},authorId:this.currUser?.id}}).subscribe(e=>{
                                    this.feedService.getAllPostApi().subscribe({});
                                });
                            }
                        }
                    )
                }else{
                    console.log("RTD");
                    
                }
            });
    }
    editTask(post: Post): void {
        if (this.currUser) {
            // verification that the post belongs to logged in user
            if (post.attributes.authorId.data.id == this.currUser.id) {
                const dialogRefEdit = this.dialog.open(NewPostComponent, {
                    width: '400px',
                    data: {
                        id: post.id,
                        title: post.attributes.title,
                        description: post.attributes.description,
                        enableDelete: true,
                    },
                });
                dialogRefEdit
                    .afterClosed()
                    .subscribe((result: PostDialogResult | undefined) => {
                        if (!result) {
                            return;
                        }
                        if (result.delete && post.id) {
                            this.feedService.deletePostApi(post.id).subscribe(e=>{
                                this.feedService.getAllPostApi().subscribe(e=>{});
                            });
                            //this.feedService.removePost(result.post);
                        } else {
                            this.feedService.updatePostApi({data:{id:result.id,title:result.title,description:result.description}}).subscribe(e=>{
                                this.feedService.getAllPostApi().subscribe(e=>{});
                            });
                        }
                    });
            }
        }else{
            console.log("KNB");
            
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
    isFollowing(id: number) {
        return this.userService.isFollowing(id);
    }
}
