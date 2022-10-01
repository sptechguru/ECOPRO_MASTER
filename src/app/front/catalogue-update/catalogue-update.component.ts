import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-catalogue-update',
  templateUrl: './catalogue-update.component.html',
  styleUrls: ['./catalogue-update.component.css']
})
export class CatalogueUpdateComponent implements OnInit {

 
createCatalogueForm : FormGroup;
//isSingleUploaded = false;
isCreateProcessing = false;
fileUpload: File=null;
id: any;
//id_int: Number = parseInt(this.id)
catalogueArray = [];
imgURL: any;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private router: Router,
    private _route : ActivatedRoute,
    private toasterService: ToasterService,
    private localStorage : StorageAccessorService,
    private _api: ApiHandlerService,
    private userService : UserService
  ) {   }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.createCata();
    this.getCataDetail();
  }

  createCata(){
    this.createCatalogueForm = this.fb.group({
      catalogue_name : ['', [Validators.required]],
      catalogue_image : ['']
    })
  }

  getCataDetail(){
    this._api.apiGet(API.QUEST_ENDPOINTS.GET_CATALOGUE_DETAILS(this.id)).subscribe({
      next:result => {
        this.catalogueArray = result.data.rows[0];
        this.createCatalogueForm.get('catalogue_name').setValue( this.catalogueArray["catalogue_name"]);
        this.imgURL = this.catalogueArray["catalogue_image_150x150"]; 
      }
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
    uploadData.append('catalogue_name', this.createCatalogueForm.value.catalogue_name);
    if(this.fileUpload){
      uploadData.append('catalogue_image', this.fileUpload);
    }else{
      uploadData.append('catalogue_image', '');
    }
     if(!this.isCreateProcessing){
      this.isCreateProcessing = true,
      this.userService.updateCatalogue(this.id, uploadData).subscribe({
        next: result => {
          if (result) {
            this.router.navigate(['/catalogue']);
            this.toasterService.Success('Details updated successfully!'); 
          } else {
            let msg = (result) ? result : 'Process faild.';
            this.createCatalogueForm.reset();
          }
          this.isCreateProcessing = false;
        },
        error: err => {
          this.toasterService.Error(err);
          this.isCreateProcessing = false;
        },
        complete: () => {
          this.isCreateProcessing = false;
        }
      });
    }
  }

  catalogueList(){
    this.router.navigate(['/catalogue']);
  }

}
