import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  baseUrl: string = environment.baseUrl;
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.userService.authToken()}`,
});

  constructor(private http: HttpClient,private userService: UserService) {
    effect(() => {
      let auth = this.userService.authToken();
      this.headers = new HttpHeaders({
          Authorization: `Bearer ${auth}`,
      });
  });
  }

  uploadImageApi(data:any){
    this.headers = new HttpHeaders({
        Authorization: `Bearer ${this.userService.authToken()}`,
    });
		return this.http
            .post<[{}]>(this.baseUrl + '/upload', data, {headers: this.headers});
	}
  deleteImageApi(id: number){
		
		return this.http
            .delete<[{}]>(this.baseUrl + '/upload/files/' + id, {headers: this.headers});
	}
}
