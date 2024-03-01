import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserCreate, UserUpdate, regSuccess } from './user';
import { StrapiResponseUser } from './strapi-types';

import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    currUser = signal<User | null>(null);
    allUsers = signal<User[]>([]);

    baseUrl: string = environment.baseUrl;
    authToken = signal<string>("");
    headers =  new HttpHeaders({
        'Authorization': `Bearer ${this.authToken()}`,
        'Content-Type': 'application/json',
    });
       
    

    constructor(private http: HttpClient) {
        let jwt = localStorage.getItem('jwt');
        if (jwt) {
            let decoded = this.getDecodedAccessToken(jwt);
            let isValid = this.isJwtValid(jwt);
            
            if (!isValid) {
                this.authToken.set(jwt);
            }else{
                // Token Expired
            }
        }else{
            // User not Logged in
        }
        effect(() => {
            let decoded = this.getDecodedAccessToken(this.authToken());
            this.headers = new HttpHeaders({
                'Authorization': `Bearer ${this.authToken()}`,
                'Content-Type': 'application/json',
            });
            
            if (this.authToken()!="") {
                this.getAllUserApi().subscribe({
                    next: (u) => {
                        this.allUsers.set(u);
                    },
                    error: (e) => {
                        console.log(e);
                    },
                });
                this.getUserApi(decoded.id).subscribe({
                    next: (u) => {
                        this.currUser.set(u);
                    },
                    error: (e) => {
                        console.log(e);
                    },
                });
            }
        })
    }

    isJwtValid(jwt: string){
        let decoded = this.getDecodedAccessToken(jwt);
        let expire = decoded.expire;
        return (Math.floor((new Date).getTime() / 1000)) >= expire;
    }
    getDecodedAccessToken(token: string): any {
        try {
          return jwtDecode(token);
        } catch(Error) {
          return null;
        }
      }

    /* API */
    getUserApi(id: number): Observable<User> {
        console.log(this.headers);
        
        return this.http.get<any>(this.baseUrl + '/users/' + id + "?populate=*", {headers: this.headers});
    }

    getAllUserApi(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl + '/users?populate=*', {headers: this.headers}).pipe(
            tap((res) => {
                this.allUsers.set(res);
            })
        );
    }
    addUserApi(data: UserCreate) {
        return this.http
            .post<regSuccess>(this.baseUrl + '/auth/local/register', data, {headers: this.headers});
    }
    updateUserApi(data: UserUpdate) {
        return this.http
            .put<User>(this.baseUrl + '/users/' + data.id, data, {headers: this.headers})
    }
    deleteUserApi(id: number) {
        return this.http
            .delete<any>(this.baseUrl + '/users/' + id, {headers: this.headers})
            .pipe(
                tap((_) => {
                    this.allUsers.set(this.allUsers().filter((user)=> {user.id !== id}))
                })
            );
    }

    // private _upsertUsers = (user: User) => {
    //     const index = this.allUsers().findIndex((u) => {
    //         u.id === user.id;
    //     });
    //     if (index === -1) {
    //         this.allUsers.set([...this.allUsers(), user]);
    //         return;
    //     }
    //     this.allUsers.mutate((users) => {
    //         users[index] = user;
    //     });
    // };

    /* UTILS */
    getCurrUser() {
        return this.currUser();
    }
    isFollowing(id: number) {
        let cu = this.currUser();
        if (cu) {
            let following = cu.following;
            
            let bol = false;
            if (following) {
                following.forEach((e) => {
                    let ur = e as User;
                    if (ur.id == id) {
                        bol = true;
                    }
                });
            }
            return bol;
        }
        return false;
    }
    getUserByMail(email: string) {
        let all = this.allUsers();
        let val = false;
        all.map(u=>{
            if (u.email == email) {
                val = true;
            }
        })
        return val;
    }
    isPasswordCorrect(userEmail: string, password: string) {
        return this.http.post<any>(
            this.baseUrl + '/auth/local', {identifier:userEmail,password:password}
        );
    }
    followUser(id: number) {
        let cu = this.getCurrUser();
        if (cu && cu.id) {
            let data = {id:cu.id, following:{connect:[id]}}
            this.updateUserApi(data).subscribe(
                u=>{
                    if (cu) {
                        this.getUserApi(cu.id).subscribe(u=>{
                            this.currUser.set(u);
                        })
                    }
                    this.getAllUserApi().subscribe(u=>{
                        this.allUsers.set(u)
                    })
                }
            )
        }
    }
    unfollowUser(id: number) {
        let cu = this.getCurrUser();
        if (cu && cu.id) {
            let data = {id:cu.id, following:{disconnect:[id]}}
            this.updateUserApi(data).subscribe(
                u=>{
                    if (cu) {
                        this.getUserApi(cu.id).subscribe(u=>{
                            this.currUser.set(u);
                        })
                    }
                    this.getAllUserApi().subscribe(u=>{
                        this.allUsers.set(u)
                    })
                }
            )
        }
    }
    setCurrentUser(u: User): void {
        this.currUser.set(u);
    }
    logout() {
        this.currUser.set(null);
    }
}
