import { Component, OnInit } from '@angular/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-buisness-profile',
  templateUrl: './buisness-profile.component.html',
  styleUrls: ['./buisness-profile.component.css'],
})

export class BuisnessProfileComponent implements OnInit {

  profileDetail: any;
  profileForm: FormGroup;
  isLoginProcessing = false;
  businessType: any;
  logo: any; 
  logos: any; 
  userData: any; 
  panelOpenState: boolean;

  constructor(private fb: FormBuilder ,
    private apiHandlerService: ApiHandlerService,
    private toasterService: ToasterService, public localStorage : StorageAccessorService) { }

  ngOnInit() {
    this.getProfileDetail();
    this.createForm();
    this.getBusniessType();
    this.userData = this.localStorage.fetchData()["data"].id;
    console.log(this.userData);
  }


  createForm() {
    this.profileForm = this.fb.group({
      business_name: ['', [Validators.required]],
      year: ['', [Validators.required]],
      logo: [''],
      business_type: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })  
  }

  getBusniessType(){
    this.apiHandlerService.apiGet(API.QUEST_ENDPOINTS.BUISNESS_TYPES+'?offset=0&limit=200').pipe().subscribe(
      {
        next:data=>{
          if(data.data){
            this.businessType = data.data.rows;
          }
        },
        error:(err: any)=> {

        }  
      })
  }

  getProfileDetail(){
    this.apiHandlerService.apiGet(API.QUEST_ENDPOINTS.GET_BUSINESS_PROFILE).pipe().subscribe(
      {
        next:data=>{
          if(data.data){
            this.profileDetail = data.data;
            this.logo = this.profileDetail.reseller_profile.business_logo;
            this.profileForm.get('business_name').setValue(this.profileDetail.reseller_profile.business_name);
            this.profileForm.get('year').setValue(this.profileDetail.reseller_profile.business_establishment_year);
            this.profileForm.get('business_type').setValue(parseInt(this.profileDetail.reseller_profile.business_type));
            this.profileForm.get('description').setValue(this.profileDetail.reseller_profile.business_description);
          }
        },
        error:(err: any)=> {

        }  
      })
  }

  onFileChange(event: any) {
    this.logos = event.target.files[0];
  }

  handleSubmit(){
      const uploadData = new FormData();
      this.profileForm.value.logo = this.logos;
      uploadData.append('business_name', this.profileForm.value.business_name);
      uploadData.append('business_establishment_year', this.profileForm.value.year);
      uploadData.append('business_type', this.profileForm.value.business_type);
      uploadData.append('description', this.profileForm.value.description);
      uploadData.append('business_logo', this.profileForm.value.logo);
      this.isLoginProcessing = true;
      this.apiHandlerService.apiPost(API.QUEST_ENDPOINTS.UPDATE_BUSINESS_PROFILE+'/'+this.userData,
        uploadData, {}, { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          if (result.message) {
            this.isLoginProcessing = false;
            this.toasterService.Success(result.message); 
            this.getProfileDetail();
          } 
        },
        error: err => {
          this.toasterService.Error(err);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        }
      });
  }
}
