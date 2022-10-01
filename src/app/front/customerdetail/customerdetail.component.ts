import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { API } from "app/shared/constants/endpoints";
@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrls: ['./customerdetail.component.scss']
})
export class CustomerdetailComponent implements OnInit {
  cutomerForm: FormGroup;
  users_id: any = "";
  users_details:any;
  isLoginProcessing = false;
  passwordHide = true;
  public list = document.getElementById('main-body');

  constructor(  private router: Router,private apiHandlerService: ApiHandlerService, private toasterService: ToasterService,private fb: FormBuilder,public translate: TranslateService,@Inject(MAT_DIALOG_DATA) public id: any,private matDialog: MatDialog, 
  public dialogRef: MatDialogRef<CustomerdetailComponent>) {
    this.list.classList.add('open-modal');
  }
  ngOnInit(): void {
    this.users_details = localStorage.getItem("userData");
    // console.log(this.users_details);

    if (this.users_details != null) {
      let newkycdd = JSON.parse(this.users_details);
      this.users_id = newkycdd.data.id;
      // console.log(this.users_id);
    }
  
    this.createForm();
  }
  createForm() {
    this.cutomerForm = this.fb.group({
      first_name: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z ]+$"),
          Validators.maxLength(30),
        ],
      ],
      business_name: ["", [Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}"
          ),
          Validators.maxLength(30),
        ],
      ],
    });
  }
  cutomerSubmit() {
    // console.log(this.cutomerForm.value);
    // console.log("data id ", this.users_id);
    let data = this.cutomerForm.value;
    // this.otpshow = false;
    // this.phonum = false;
    let paylod = {
      id: this.users_id,
      first_name: data.first_name,
      password: data.password,
      business_name: data.business_name,
    };
    // console.log(this.emailForm.value);
    this.apiHandlerService
      .apiPost(API.AUTH_ENDPOINTS.USER_DETAILS_UPDATE, paylod)
      .subscribe(
        (res) => {
          // console.log(res.data.valid_account == "yes");
          if (res) {
           this.toasterService.Success(res.message);
           let newvalidacnt= res.data.valid_account;
         
           let userdatas=JSON.parse(localStorage.getItem('userData'))
                  
           let newvalue=res.data.valid_account;
           userdatas.data.valid_account = newvalue;
           userdatas.data.full_name =  data.first_name

      localStorage.setItem("userData",JSON.stringify(userdatas));
            this.router.navigate(["prefered-products"]);
           
          }
          else {
            this.toasterService.Error(res.error);
          }
        },
        (error) => {
          // console.log(error);
          this.toasterService.Error("server error", error);
        }
      );
  }

  ngOnDestroy(): void {
    this.list.classList.remove('open-modal');
  }
}
