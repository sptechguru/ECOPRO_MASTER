import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';

import { DialogService } from '../front-header/dialog/dialog.service';

@Component({
  selector: 'app-create-catalogue',
  templateUrl: './create-catalogue.component.html',
  styleUrls: ['./create-catalogue.component.css']
})
export class CreateCatalogueComponent implements OnInit,OnDestroy {

createCatalogueForm : FormGroup;
isSingleUploaded = false;
isCreateProcessing = false;
fileUpload: File = null;
imgURL: any;
addCatalogueUrl;
variantid;
  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private router: Router,
    private toasterService: ToasterService,
    private localStorage : StorageAccessorService,
    private apiHandlerService: ApiHandlerService,
    private DialogService: DialogService,
    private _route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.addCatalogueUrl= sessionStorage.getItem('AddCatalogue');
    console.log(this.addCatalogueUrl);
    this.createCata()
    this.variantid=this._route.snapshot.paramMap.get('id');
    console.log(this.variantid);
  }

  createCata(){
    this.createCatalogueForm = this.fb.group({
      catalogue_name : ['', [Validators.required]],
      // catalogue_image : ['']
    })
  }

  // onFileChange(files: FileList) {
  //   this.fileUpload = files.item(0);
  //   var reader = new FileReader();
  //   reader.readAsDataURL(files[0]); 
  //   reader.onload = (_event) => { 
  //     this.imgURL = reader.result; 
  //   }
  // }
  addProductIntoCatalogue(id){
    let catalogue_id = id;
    this.apiHandlerService.apiPost(API.QUEST_ENDPOINTS.ADD_PRODUCT_INTO_CATA(catalogue_id,this.variantid), {}).subscribe({
      next: result =>{
        if(result.message){
          this.toasterService.Success(result.message);
        }
      }
    })
  }

  handleSubmitForm(){
    // if(!this.fileUpload){
    //   this.toasterService.Error("Catalogue Image is required");
    // }else {
      const uploadData = new FormData();
      uploadData.append('catalogue_name', this.createCatalogueForm.value.catalogue_name);
      // uploadData.append('catalogue_image', this.fileUpload);
      this.isCreateProcessing = true,
      this.apiHandlerService.apiPost(API.QUEST_ENDPOINTS.CREATE_CATALOGUE, uploadData, {}, 
        { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          if (result.message) {
            if(this.variantid){
              this.addProductIntoCatalogue(result.data)
            }
            // this.router.navigate(['/catalogue-multiple-products',{catalogue_id: result.data}]);
            if(this.addCatalogueUrl==null){
              this.router.navigate(['/catalogue']);
            } 
            else{
              this.router.navigate([this.addCatalogueUrl]);
            }
             this.toasterService.Success('Catalogue created successfully!'); 
          } else {
            let msg = 'Process faild.';
            this.createCatalogueForm.reset();
            this.toasterService.Error(msg);
          }
          this.isCreateProcessing = false;
          this.isSingleUploaded = false;
        },
        error: err => {
          if(err){
            this.toasterService.Error(err);
          }else{
            this.toasterService.Error("Validation error: Catalogue name only allow letters and space.");
          }
          this.isCreateProcessing = false;
        },
        complete: () => {
          this.isCreateProcessing = false;
        }
      });
    // }
  }

  catalogueList(){
    
    this.router.navigate(['/catalogue']);
  }
  ngOnDestroy(): void {
      sessionStorage.removeItem('AddCatalogue');
  }

  /*handleSubmitForm(){
    this.isSingleUploaded = true;
    if(this.createCatalogueForm.value.catalogue_image == ''){
      this.toasterService.Error("Catalogue Image is required");
    }
    else if(!this.isCreateProcessing){
      this.isCreateProcessing = true,
      this.isSingleUploaded = false
      let formData = this.prepareCreateFormData(this.createCatalogueForm)
      this.apiHandlerService.apiPost(API.QUEST_ENDPOINTS.CREATE_CATALOGUE, formData, {}, { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          if (result.message) {
             this.router.navigate(['/catalogue-multiple-products',{catalogue_id: result.data}]);
             this.toasterService.Success('Details Update SuccessFully!'); 
          } else {
            let msg = 'Process faild.';
            this.createCatalogueForm.reset();
            this.toasterService.Error(msg);
          }
          this.isCreateProcessing = false;
          this.isSingleUploaded = false;
        },
        error: err => {
          if(err){
            this.toasterService.Error(err);
          }else{
            this.toasterService.Error("Validation error: Catalogue name only allow letters and space.");
          }
          this.isCreateProcessing = false;
        },
        complete: () => {
          this.isCreateProcessing = false;
        }
      });
    }
  }

  prepareCreateFormData(form : FormGroup): any {
    const value = form.value 
     let formData = new FormData();
     Object.keys(value).forEach((formControlName) => {
     formData.append(formControlName, form.get(formControlName).value);
     });
     return formData;
   }

   onFileChange(files: FileList) {
    this.isSingleUploaded = false;
    this.fileUpload = files.item(0)
    const formData: FormData = new FormData();
    formData.append('file', this.fileUpload, this.fileUpload.name);
    const file = this.fileUpload;
    this.createCatalogueForm.patchValue({
      catalogue_image: files.item(0)
    });
    this.createCatalogueForm.get('catalogue_image').updateValueAndValidity();
    
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  catalogueList(){
    this.router.navigate(['/catalogue']);
  }

  get catalogue_name() {
    return this.createCatalogueForm.get('catalogue_name');
  }*/

}
