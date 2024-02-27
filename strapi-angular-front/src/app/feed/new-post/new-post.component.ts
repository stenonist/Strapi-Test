import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FeedService } from 'src/app/service/feed.service';
import { Post } from 'src/app/service/post';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  /* shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: File|null = null; // Variable to store file */

  // private backupPost: Partial<Post> = { ...this.data.post };
  theFile: any = null; 
  constructor(private feedService: FeedService, public dialogRef: MatDialogRef<NewPostComponent>, @Inject(MAT_DIALOG_DATA) public data: PostDialogData) {
  }

  isImageSaved: boolean = false;
  cardImageBase64: string = '';

  ngOnInit(): void {
    /* if (this.data.post.attributes) {
      this.isImageSaved = true;
      // this.cardImageBase64 = this.data.post.attributes.photo;
    } */

  }

  cancel(): void {
    /* if (this.data.post.attributes && this.backupPost.attributes) {
      this.data.post.attributes.title = this.backupPost.attributes.title;
      this.data.post.attributes.description = this.backupPost.attributes.description;
      this.data.post.attributes.photo = this.backupPost.attributes.photo;
      this.data.post.attributes.date = this.backupPost.attributes.date;
      this.data.post.attributes.tags = this.backupPost.attributes.tags;
    } */
    this.dialogRef.close(this.data);
  }

  CreateBase64String(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;         
          this.isImageSaved = true;
          // this.data.post.photo = imgBase64Path;          
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onChange(event:any) {
    this.theFile = event.target.files[0];
  }

  /* onUpload() {
      this.loading = !this.loading;
      console.log(this.file);
      this.feedService.upload(this.file).subscribe(
          (event: any) => {
              if (typeof (event) === 'object') {
                  console.log(event);
                  this.shortLink = event.link;
                  this.loading = false;
              }
          }
      );
  } */

}
export interface PostDialogData {
  id: string,
  title: string,
  description: string,
  photoFile: any,
  enableDelete: boolean;
}

export interface PostDialogResult {
  id: string,
  title: string,
  description: string,
  photoFile: any,
  enableDelete: boolean;
  delete?: boolean;
}
