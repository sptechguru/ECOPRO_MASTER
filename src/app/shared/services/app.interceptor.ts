import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { TimeoutError } from 'rxjs/util/TimeoutError';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { error_msg } from 'app/shared/constants/consts';
import { ToasterService } from 'app/shared/services/toaster.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private localStorage: StorageAccessorService,
    private toaster: ToasterService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | Observable<any> {

    const token = this.localStorage.fetchToken();
    const code = localStorage.getItem('auth_code') ? localStorage.getItem('auth_code') : '';
    const newReq = request.clone({
      setHeaders: {
        'access_token': token,
        'Authorization':code
      }
    });

    return next.handle(newReq)
      .catch(err => {
        let errorMsg;
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.toaster.Error('Please login again', 'Session Expired');
          this.localStorage.deleteToken();
          this.localStorage.deleteData();
          this.router.navigate(['']);
          return Observable.empty();
        }

        if (err instanceof HttpErrorResponse && err.error.error.statusCode === 400) {
          console.log(err.error.message.error.description);
          this.toaster.Error(err.error.message.error.description);
          return Observable.empty();
        }

        if (err instanceof HttpErrorResponse && err.status === 403) {
          console.log(err.error.message);
          this.toaster.Error(err.error.message);
          return Observable.empty();
        }

        if (err instanceof HttpErrorResponse && err.status === 404) {
          console.log(err.error.message);
          this.toaster.Error(err.error.message);
          return Observable.throw(err.error.message);
        }

        if (err instanceof HttpErrorResponse && err.status === 500) {
          //console.log(err.error.message);
          this.toaster.Error(err.error.message);
          return Observable.empty();
        }

        if (err instanceof HttpErrorResponse && err.status === 400) {
          //console.log(err.error.message);
          this.toaster.Error(err.error.message);
          return Observable.empty();
        }

        /*if (err instanceof HttpErrorResponse && err.status === 400) {
          console.log(err.error.message);
          this.toaster.Error(err.error.message);
          return Observable.empty();
        }*/

        if (err instanceof HttpErrorResponse && err["statusCode"] === 400) {
          console.log(err.error.message);
          this.toaster.Error(err.error.message);
         // this.toaster.Error(error_msg.UNAUTHORIZED_ACCESS);
          //this.router.navigate(['/admin/dashboard']);
          return Observable.empty();
        }
       // console.log('err instanceof HttpErrorResponse : ', err instanceof HttpErrorResponse);
       // console.log('(err.status == 422) : ', (err.status == 422));
       // console.log('err : ', err.error.error[0].msg);
        if (err instanceof HttpErrorResponse && (err.status == 422)) {
          if (err.error && err.error.error[0] && err.error.error[0].msg)
            errorMsg = err.error.error[0].msg;
          else
            errorMsg = 'Something went wrong unable to process.';
        }

        if (err instanceof HttpErrorResponse && (err.error.error.statusCode == 400)) {
          if (err.error.error.error.description){
            console.log(err.error.error.error.description);
            errorMsg = err.error.error.error.description;
          }
          else{
            errorMsg = 'Something went wrong unable to process.';
          }
        }
        return Observable.throw(errorMsg);
      });
  }

}
