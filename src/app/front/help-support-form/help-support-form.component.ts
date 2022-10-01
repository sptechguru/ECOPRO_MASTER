import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { DialogService } from '../front-header/dialog/dialog.service';

@Component({
  selector: 'app-help-support-form',
  templateUrl: './help-support-form.component.html',
  styleUrls: ['./help-support-form.component.css']
})
export class HelpSupportFormComponent implements OnInit {
 
helpSuportForm : FormGroup;
isSingleUploaded = false;
isCreateProcessing = false;
fileUpload: File = null;
imgURL: any;
routeTypeValue;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private router: Router,
    private toasterService: ToasterService,
    private localStorage : StorageAccessorService,
    private apiHandlerService: ApiHandlerService,
    private DialogService: DialogService
  ) {
    const sliptroutUrl = this.router.url.split('/'); 
    this.routeTypeValue = sliptroutUrl[1];
    console.log(this.routeTypeValue, 'this.routeTypeValue');
        this.createForm()
   }

  ngOnInit() {
  }


  createForm(){
    this.helpSuportForm = this.fb.group({
      title : ['', [Validators.required]],
      description : ['', [Validators.required]],
      // fileUploadimg : ['', [Validators.required]]
    })
  }

  onFileChange(files: FileList) {
    this.fileUpload = files.item(0);
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  handleSubmitForm(){
      const uploadData = new FormData();
      uploadData.append('title', this.helpSuportForm.value.title);
      uploadData.append('description', this.helpSuportForm.value.description);
      uploadData.append('request_image', this.fileUpload);
      this.isCreateProcessing = true;
      let url;
      if(this.routeTypeValue === 'help_support') {
        url = API.QUEST_ENDPOINTS.HELP_AND_SUPPORT_FORM
      } else {
        url = API.QUEST_ENDPOINTS.FEEDBACK_AND_SUPPORT_FORM
      }
      this.apiHandlerService.apiPost(url, uploadData, {}, 
        { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          if (result.message) {
             this.toasterService.Success(result.message); 
             this.router.navigate(['/prefered-products']);
          } else {
            let msg = 'Process faild.';
            this.helpSuportForm.reset();
            this.toasterService.Error(msg);
          }
          this.isCreateProcessing = false;
          this.isSingleUploaded = false;
        },
        error: err => {
          if(err){
            this.toasterService.Error(err);
          }
          this.isCreateProcessing = false;
        },
        complete: () => {
          this.isCreateProcessing = false;
        }
      });
    }
}
