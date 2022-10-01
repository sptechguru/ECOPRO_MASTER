import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import { catchError, map, tap } from 'rxjs/operators';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

interface ErroeObject {
  caller?: string;
  errorTitle?: string;
  errorMessage?: string;
}

interface Extras {
  contentType: {
    isFormDataContent?: boolean;
    isJsonContent?: boolean;
  };
}

interface HttpResponseData {
  data?: any;
  message?: any;
  error?: any;
  success?: any;
}

@Injectable()
export class ApiHandlerService {

  constructor(private http: HttpClient, private localStorage: StorageAccessorService) { }

  apiGet(url, params?, extras?: Extras) {
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    return this.http.get<any>(url, options).timeout(20000);
  }

  apiPost(url, reqBody, params?, extras?: Extras) {
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    reqBody = reqBody ? reqBody : {};
    return this.http.post<HttpResponseData>(url, reqBody, options).timeout(20000);
    // return this.http.post(url, reqBody, options).map(res => res as Order[] || []).timeout(20000);
  }

  apiPost2(url, reqBody, params?, extras?: Extras) {
    let options = this.renderHeaders2(extras);
    options = this.appendParams(options, params);
    reqBody = reqBody ? reqBody : {};
    return this.http.post<HttpResponseData>(url, reqBody, options).timeout(20000);
  }

  apiUpdate(url, reqBody, params?, extras?: Extras) {
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    return this.http.put(url, reqBody, options).timeout(20000);
  }

  apiDelete(url, params?, extras?) {
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    return this.http.delete(url);
  }
  

  private renderHeaders(extras: Extras) {
    if (extras) {
      if (extras.contentType.isFormDataContent) {
        return {};
      }
    } else {
      // else assume it to be json data
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Expires': '-1',
          'Pragma': 'no-cache',
        })
      };
    }
  }


  private renderHeaders2(extras: Extras) {
    if (extras) {
      if (extras.contentType.isFormDataContent) {
        return {};
      }else{
        return {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Expires': '-1',
            'Pragma': 'no-cache',
          })
        };
      }
      
    } else {
      // else assume it to be json data
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Expires': '-1',
          'Pragma': 'no-cache',
        })
      };
    }
  }

  private appendParams(originalOptions, paramsObj) {
    let params = new HttpParams();
    for (const key in paramsObj) {
      if (paramsObj.hasOwnProperty(key)) {
        params = params.append(key, paramsObj[key]);
      }
    }
    return Object.assign({}, originalOptions, { params: params });
  }


  isLoggedIn(){
    return localStorage.getItem('userData');
  }

}
