import { Component, OnInit } from '@angular/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private _api : ApiHandlerService,
    private toasterService: ToasterService
  ) { }
  email = new FormControl('', [Validators.required, Validators.email]);
  submitted = false;
  ngOnInit() {
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

 submit(){
   this.submitted = true;
   if(this.email.invalid)return;

   this._api.apiPost(API.AUTH_ENDPOINTS.FORGET_PASSWORD,{email:this.email.value,verification_type:'email'}).subscribe(
    {
      next:res=>{
          this.toasterService.Success('Email has been send')
        
      },
      error:err=>{
        this.toasterService.Error('Email not found')
      }
    }
    )

 }

}
