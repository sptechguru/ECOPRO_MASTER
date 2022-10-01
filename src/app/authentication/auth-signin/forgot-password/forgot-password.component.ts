import { Component, OnInit, Inject } from '@angular/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { error_msg } from 'app/shared/constants/consts';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from 'app/front/front-header/dialog/dialog.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FrontHeaderComponent } from 'app/front/front-header/front-header.component';
import { FormGroup, FormBuilder, Validators ,FormControl} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [FrontHeaderComponent]
})
export class ForgotPasswordComponent implements OnInit {
 
  isProcessing = false;
  forgotPasswordForm: FormGroup;

  constructor(public matDialog: MatDialog, private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public id: any,
    private _api : ApiHandlerService, private _alert : ToasterService,public translate: TranslateService,
    public dialog: FrontHeaderComponent, public dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) { 
    this.createFormValidation();
  }

  ngOnInit() {}

  createFormValidation() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  
  showSignup() {
    this.dialog.showSignup();
  };

  handleSubmit(){
    const api = this.id === 'password' ?  API.AUTH_ENDPOINTS.RESEND_EMAIL: API.AUTH_ENDPOINTS.FORGET_PASSWORD;
    this._api.apiPost(api,{email: this.forgotPasswordForm.value.email,verification_type:'email'}).subscribe(
    {
      next:res=>{
        if(res.success){
          this._alert.Success("Please check email to proceed for password reset.")
          this.forgotPasswordForm.reset()
        }else this._alert.Error('Email not found')
      },
      error:err=>{
        this._alert.Error('Email id is not exist')
      }
     }
    )
  }
}