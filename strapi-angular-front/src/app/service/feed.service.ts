import { HttpClient, HttpHeaders } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post, PostAdd, PostGet, PostUpdate } from './post';
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
                Authorization: `Bearer ${auth}`,
                'Content-Type': 'application/json',
            });
            this.uploadHeaders = new HttpHeaders({
                Authorization: `Bearer ${auth}`,
            });
            if (auth) {
                this.getAllPostApi().subscribe((res) => {
                    let data = res as { data: [] };
                    this.posts.set(data.data);
                });
            }
        });
    }

    baseUrl: string = environment.baseUrl;

    getPostApi(id: number) {
        return this.http.get<any>(
            this.baseUrl + '/posts/' + id + '?populate=*',
            { headers: this.headers }
        );
    }
    getAllPostApi() {
        return this.http
            .get<any>(this.baseUrl + '/posts?populate=*', { headers: this.headers })
            .pipe(
                tap((res) => {
                    this.posts.set(res.data);
                })
            );
    }
    addPostApi(data: PostAdd) {
		console.log(data);
		
        return this.http
            .post<PostUpdate>(this.baseUrl + '/posts', JSON.stringify(data), {
                headers: this.headers,
            })
            .pipe(
                tap((p) => {
                    if (p.data) {
                        this.getPostApi(parseInt(p.data.id)).subscribe(
                            (post) => {
                                this._upsertPosts(post.data);
                            }
                        );
                    }
                })
            );
    }
    updatePostApi(data: PostUpdate) {
        return this.http
            .put<PostGet>(this.baseUrl + '/posts/' + data.data.id, data, {
                headers: this.headers,
            })
            .pipe(
                tap((p) => {
                    if (data.data.id) {
                        this.getPostApi(parseInt(data.data.id)).subscribe((post) => {
                            this._upsertPosts(post.data);
                        });
                    }
                })
            );
    }
    deletePostApi(id: number) {
        return this.http
            .delete<Post>(this.baseUrl + '/posts/' + id, {
                headers: this.headers,
            })
            .pipe(
                tap((_) => {
                    this.posts.set(
                        this.posts().filter((post) => {
                            return post.id !== id;
                        })
                    );
                })
            );
    }

    private _upsertPosts = (post: any) => {
        console.log(post);

        const index = this.posts().findIndex((p) => {
            return p.id === post.id;
        });
        if (index === -1) {
            this.posts.set([...this.posts(), post]);
            return;
        }
        this.posts.mutate((posts) => {
            posts[index] = post;
        });
    };

    getPostCount(id: any) {
        return this.http.get<any>(
            this.baseUrl + '/posts?filters[theAuthor][id][$eq]=' + id,
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
      if (p.theAuthor === id) {
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
