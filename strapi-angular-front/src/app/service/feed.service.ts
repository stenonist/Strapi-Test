import { HttpClient, HttpHeaders } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post, PostAdd, PostUpdate } from './post';
import { UserService } from './user.service';
import { StrapiResponsePost } from './strapi-types';

@Injectable({
    providedIn: 'root',
})
export class FeedService {
    posts = signal<Post[]>([]);
    followingPosts = signal<Post[] | null>([]);
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.userService.authToken()}`,
    });
    uploadHeaders = new HttpHeaders({
        Authorization: `Bearer ${this.userService.authToken()}`,
    });

    constructor(private http: HttpClient, private userService: UserService) {
		effect(() => {

            let auth = this.userService.authToken();
            this.headers = new HttpHeaders({
                'Authorization': `Bearer ${auth}`,
                'Content-Type': 'application/json',
            });
			this.getAllPostApi().subscribe((res) => {
				let data = res as {data:[]};
				this.posts.set(data.data);
			});
            
        })
    }

    baseUrl: string = environment.baseUrl;

    getPostApi(id: number): Observable<Post> {
        return this.http.get<any>(
            this.baseUrl + '/posts/' + id + '?populate=*',
            { headers: this.headers }
        );
    }
    getAllPostApi() {
        return this.http
            .get(this.baseUrl + '/posts?populate=*', { headers: this.headers })
            .pipe(
                tap((res) => {
                    let result = res as StrapiResponsePost;
                    this.posts.set(result.data);
                })
            );
    }
    addPostApi(data: PostAdd) {
        /* First need to upload the File, then retrieve it and send a post Method with it. */
        return this.http.post(this.baseUrl + '/posts', JSON.stringify(data), {
            headers: this.headers,
        });
    }
    updatePostApi(data: PostUpdate): Observable<Post> {
        return this.http.put<Post>(
            this.baseUrl + '/posts/' + data.data.id,
            data,
            { headers: this.headers }
        );
        // .pipe(tap(this._upsertPosts));
    }
    deletePostApi(id: number) {
        return this.http.delete<Post>(this.baseUrl + '/posts/' + id, {
            headers: this.headers,
        });
    }

    /* getFollowingPosts() : Observable<Post[]> {
        let u = this.userService.currUser();
		if (!u) {return;}
		let following = u.following;
		if (!following) {return;}
		let url = this.baseUrl + '/posts?';
		following.forEach(fid => {
			url += "/authorId=" + fid + "&"
		});
		return this.http
			.get<Post[]>(url)
			.pipe(
				tap((res) => {
					this.followingPosts.set(res);
				})
			);
    } */

    getPostCount(id: any) {
        return this.http.get<any>(
            this.baseUrl + '/posts?filters[authorId][id][$eq]=' + id,
            { headers: this.headers }
        );
    }

    /* 

  getPostCount(id:number|undefined){
    if (id) {
      let found = this.getPostsByUserId(id);
      return found.length;
    }else{
      return 0;
    }
  }

  getPostsByUserId(id:number): Post[]{
    let foundPosts: Post[] = []; 
    FeedService.dummyPosts.forEach(p=>{
      if (p.authorId === id) {
        foundPosts.push(p);
      }
    })
    return foundPosts;
  }
  getAllPostsFromFollowing(): Post[]{
    let foundPosts:Post[] = [];
    let currUser = this.userService.getCurrUser();
    let currUserFollowing = currUser?.following;
    if (currUserFollowing) {
      currUserFollowing.forEach(f=>{
        let userPosts = this.getPostsByUserId(f);
        if (userPosts) {
          foundPosts.push(...userPosts);
        }
      })
    }
    return foundPosts;
  }
  */
}
