import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.css'],
 
})
export class OtpDialogComponent implements OnInit {

  otp: any;
  contactForm: FormGroup;
  isLoading: boolean;

  constructor(public matDialog: MatDialog, public dialogRef: MatDialogRef<OtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private apiHandlerService: ApiHandlerService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.contactForm = this.fb.group({
      otp: ["", [Validators.required]]
    });
  } 

  handleSubmit1(){
    this.isLoading = true;
      this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.VERIFY_OTP, 
        {otp_code: this.contactForm.value.otp, device_type: 'web', device_id: ''}).subscribe({
        next: result => {
          if(result.data && result.data.access_token){
           
          }else{
            
          }
        },
        error: err => {
          console.log(err);
          let msg = (err.error && err.error.message) ? err.error.message : 'Invalid Credentials';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

}
