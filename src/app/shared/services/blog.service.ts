import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BlogService {

  baseUrl =  environment.baseUrl;

  constructor(private http: HttpClient) { }

  getBlogList(offset, limit){
    return this.http.get(this.baseUrl+`/api/reseller/get-blog?offset=`+offset+`&limit=`+limit);
  }

  roadBrackBannerImg(offset, limit){
    return this.http.get(this.baseUrl+`/api/reseller/get-road-block-banner?offset=`+offset+`&limit=`+limit);
  }

  getBlogDetail(id){
    return this.http.get(this.baseUrl+`/api/reseller/get-blog-details/${id}`);
  }
}
