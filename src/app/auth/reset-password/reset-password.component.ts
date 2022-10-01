import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { patternValidator, password } from 'app/shared/custom/customValidation';
import { API } from 'app/shared/constants/endpoints';
import { DialogBoxService } from 'app/shared/services/dialog-box.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import {MustMatch} from './must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  createPassword :Boolean
  passwordHide = true;
  confirmHide = true
  passwordForm: FormGroup;
  email_code: any;
  isLoginProcessing: boolean = false;

  constructor(
    private _fb : FormBuilder,
    private _api :ApiHandlerService,
    private _route : ActivatedRoute,
    private toasterService: ToasterService,
    private _router : Router,
    private _dialog : DialogBoxService
  ) {}

  ngOnInit() {
    this.email_code  = this._route.snapshot.paramMap.get('code');
    this.createForm();
  }

  
  createForm(){
    this.passwordForm = this._fb.group({
      password: ['', [Validators.required, 
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]],
        confirm_password: ['', [Validators.required]],
      }, {
        validator: MustMatch('password', 'confirm_password'),
    })
  }

  handleSubmitFirst(){
    const formVal = {
    email_code: this.email_code,
    password: this.passwordForm.value.password,
    confirm_password: this.passwordForm.value.confirm_password} 
    this.isLoginProcessing = true;
    this._api.apiPost(API.AUTH_ENDPOINTS.RESET_PASSWORD,formVal).subscribe({
      next : result=> {
            this.isLoginProcessing = false;
            this.toasterService.Success('Your Password has been changed successfully!', 'Password Updated')
            setTimeout(()=>{
              this._router.navigate(['/'])
            },2000)
          },
      error: err=> {
        this.isLoginProcessing = false;
        this.toasterService.Error('Your link is expired','Create new request');
      }
    })
  }
}
