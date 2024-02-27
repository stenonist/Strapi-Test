import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  baseUrl: string = environment.baseUrl;
  headers = new HttpHeaders({
		'Authorization': `Bearer ${environment.token}`
	 })

  constructor(private http: HttpClient) { }

  uploadImageApi(data:any){
		
		return this.http
            .post<[{}]>(this.baseUrl + '/upload', data, {headers: this.headers});
	}
}
