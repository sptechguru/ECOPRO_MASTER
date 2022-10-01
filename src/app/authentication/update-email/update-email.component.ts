import { Component, OnInit, Inject, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FrontHeaderComponent } from 'app/front/front-header/front-header.component';
import { FormBuilder, FormGroup, FormArray , FormControl, Validators, AbstractControl} from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { error_msg } from 'app/shared/constants/consts';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { HttpClient } from '@angular/common/http';
import { API } from 'app/shared/constants/endpoints';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StorageAccessorService, UserData } from 'app/shared/services/localstorage-accessor.service';
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { environment } from 'environments/environment';
import { DialogService } from 'app/front/front-header/dialog/dialog.service';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { tap } from 'rxjs/operators';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.scss'],
  providers: [FrontHeaderComponent,  ConfirmationDialogHandlerService, 
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }]
})
export class UpdateEmailComponent implements OnInit {

   emailChangeForm: FormGroup;
   isLoginProcessing = false;
   user_id: any;
   
  constructor( @Inject(MAT_DIALOG_DATA) public id: any,private matDialog: MatDialog,private fb: FormBuilder ,
   private http: HttpClient,public translate: TranslateService,private userservice : UserService ,
   private commModel: DialogService,
   private router: Router, public dialog: FrontHeaderComponent,private toasterService: ToasterService,
    private apiHandlerService: ApiHandlerService,
    private dialogRef: MatDialogRef<UpdateEmailComponent>,
    private localStorage: StorageAccessorService, 
    private user : UserService,
    public DialogService: DialogService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService) { 
      translate.addLangs(['en', 'hi']);
      translate.setDefaultLang('en');
    }
    public registerForm: FormGroup;
    registrationForm: any;
 
    ngOnInit() {}

    changeEmailForm(){
      this.emailChangeForm = this.fb.group({
        email_change: ['', [Validators.required, Validators.email]]
      }) 
    }

    emailUpdate(){
      const uploadData = new FormData();
      uploadData.append('update_type', 'email');
      uploadData.append('email', this.emailChangeForm.value.email_change);
      this.updateFunction(uploadData);
    }

    updateFunction(data){
      this.isLoginProcessing = true;
      this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.UPDATE_PROFILE+'/'+this.user_id, data, {},
        { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          if(result.message){
            this.toasterService.Error(result.message);
          }
          this.isLoginProcessing = false;
        },
        error: err => {
          let msg = (err.error && err.error.message) ? err.error.message : err;
          this.toasterService.Error(err);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        }
      });
    }
}
