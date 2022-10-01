import { Component, OnInit } from '@angular/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {

  savedProfile= true;
  editProfile= false;
  profileDetail: any;
  profileForm: FormGroup;
  isLoginProcessing = false;
  profilePic: any;
  userData: any;
  profilePics: any;
  
  constructor(private fb: FormBuilder ,
    private apiHandlerService: ApiHandlerService,
    private toasterService: ToasterService, public localStorage: StorageAccessorService) { }

  showProfile() {
    this.editProfile= true;
    this.savedProfile= false;
  };

  ngOnInit() {
    this.getProfileDetail();
    this.createForm();
    this.userData = this.localStorage.fetchData()["data"].id;
  }

  createForm() {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      profile_pic: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    })  
  }

  getProfileDetail(){
    this.apiHandlerService.apiGet(API.USER_ENDPONTS.GET_PROFILE).pipe().subscribe(
      {
        next:data=>{
          if(data.data){
            this.profileDetail = data.data;
            this.profilePic = this.profileDetail.profile_pic_150x150;
            this.profileForm.get('first_name').setValue(this.profileDetail.first_name);
            this.profileForm.get('last_name').setValue(this.profileDetail.last_name);
            this.profileForm.get('email').setValue(this.profileDetail.email);
            this.profileForm.get('phone').setValue(this.profileDetail.phone_number);
          }
        },
        error:(err: any)=> {

        }  
      })
  }

  onFileChange(event: any) {
    this.profilePics = event.target.files[0];
  }

  handleSubmit(){
    const uploadData = new FormData();
    this.profileForm.value.profilePic = this.profilePics;
    uploadData.append('first_name', this.profileForm.value.first_name);
    uploadData.append('last_name', this.profileForm.value.last_name);
    uploadData.append('email', this.profileForm.value.email);
    uploadData.append('phone_number', this.profileForm.value.phone);
    uploadData.append('profile_pic', this.profileForm.value.profilePic);
    this.isLoginProcessing = true;
    this.apiHandlerService.apiPost(API.USER_ENDPONTS.UPDATE_USER_PROFILE+'/'+this.userData,uploadData,{}, 
      { contentType: { isFormDataContent: true } }).subscribe({
      next: result => {
        if (result.message) {
          this.isLoginProcessing = false;
          this.toasterService.Success(result.message); 
          this.getProfileDetail();
        }
      },
      error: err => {
        this.isLoginProcessing = false;
        this.toasterService.Error(err);
        this.isLoginProcessing = false;
      },
      complete: () => {
        this.isLoginProcessing = false;
      }
    });
  }

}
