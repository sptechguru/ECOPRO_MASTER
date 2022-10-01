import { ApiHandlerService } from './../shared/services/api-handler.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthgurdGuard implements CanActivate {

  constructor(private router:Router,public api:ApiHandlerService){

  }

  canActivate(): boolean {
  if(this.api.isLoggedIn()){
      console.log("your login succefully..");
      return true
    }
    this.router.navigate(['login']);
    alert('Oops..You are not Login .error');
    return false
}
  
}
