import { KycdilogformComponent } from './../kycdilogform/kycdilogform.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { error_msg } from 'app/shared/constants/consts';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { tap } from 'rxjs/operators';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { DialogService } from '../front-header/dialog/dialog.service';
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subject } from "rxjs/Subject";
import { MatSelect } from '@angular/material/select';
import { UserService } from 'app/shared/services/user.service';
import { take, takeUntil } from "rxjs/operators";
import { MyErrorStateMatcher } from 'app/shared/custom/customValidation';
// import pincodeDirectory from "india-pincode-lookup";

export interface DialogData {
  title?: "Update Stock";
  quantity?: any;
  sstock?: any;
  rstock?: any;
  cancelText?: any;
}
@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})

export class KycComponent implements OnInit {

  openAddressForm = false;
  submitted = false;
  loading = false;
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  @ViewChild("fileToUpload", { static: false }) fileToUpload: ElementRef;
  errorMessages = error_msg;
  kycFormData: any = {}
  isSingleUploaded = false;
  isLoginProcessing = false;
  public imagePath;
  imgURL: any;
  public message: string;
  gstUpload: File = null;
  checkUpload: File = null;
  buisnessTenUpload: File = null;
  buisnessPanUpload: File = null;
  formData = new FormData();
  Error: any;
  pan_url: any;
  aadhar_url: any;
  gst_url: any;
  current_account_check_url: any;
  business_tan_reg_cert_url: any;
  business_pan_card_url: any;
  pan_image: any;
  aadhar_image: any;
  gst_image: any;
  current_account_check_image: any;
  business_tan_reg_cert_image: any;
  business_pan_card_image: any;
  personal_kyc_status: boolean = true;
  gst_ext: any;
  b_current_account_ext: any;
  b_tan_ext: any;
  b_pan_ext: any;
  connectLoader = false;
  countries = [];
  states = [];
  cities = [];
  addressForm: FormGroup;
  verifyotpForm:FormGroup;
  emailForm:FormGroup;  
  isProcessing: boolean;
  country_list: any;
  StateList: any;
  CityList: any;
  user_id: any;
  addressList: any = [];
  selected_address: any;
  business_name: any;
  addressStatus: boolean = false;
  navbarfixed:boolean = false;
  kycdata: any;
  gstno: any;
  gststatus: any;
  otpshow:boolean = false;
  gstform:boolean = false;
  verifyemail:boolean = true;
  changemail:boolean = false;
  userdata:any;
  emailverify:any;
  count=0;
  resendflg=false;
 emaildisable=false;

  public country: FormControl = new FormControl();

  public countryFilterCtrl: FormControl = new FormControl();


  public filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public state: FormControl = new FormControl();

  public stateFilterCtrl: FormControl = new FormControl();


  public filteredStates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public city: FormControl = new FormControl();

  public cityFilterCtrl: FormControl = new FormControl();


  public filteredCities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);



  @ViewChild("singleSelect") singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    public translate: TranslateService,
    private user: UserService,
    private router: Router,
    private toasterService: ToasterService,
    private localStorage: StorageAccessorService,
    private apiHandlerService: ApiHandlerService,
    private DialogService: DialogService,
    public dailog: MatDialog) { }

  ngOnInit(): void {
    this.kycdata = localStorage.getItem('kyc');
this.userdata= localStorage.getItem('userData');
if(this.userdata !=null)
{
  let userdatas=JSON.parse(this.userdata)
  this.emailverify=userdatas.email_verification
  //console.log(this.emailverify)
}
    // console.log(this.kycdata)
    if (this.kycdata != null) {
      let newkycdd = JSON.parse(this.kycdata);
      this.gstno = newkycdd.gst_no;
      this.gststatus = newkycdd.gst_status;
    }
    this.createForm();
    this.otpForm();
    this.emailFormValue();
    this.stateList('');
    this.openAddressForm = true;
    let userData = this.localStorage.fetchData();
    this.user_id = userData["data"].id;
    this.getDeliveryAddress(this.user_id);
    // console.log('kyc called ..............');
  }



  getAddresses(data: any) {
    //  console.log("new pincode functiolity..");
    // data = this.addressForm.value.pincode;
    // if (data > 5) {
    //   // console.log(data);
    //   let pindata = pincodeDirectory.lookup(data);
    //   this.addressForm.patchValue({
    //     address1: pindata[0]?.officeName,
    //     state: pindata[0]?.stateName,
    //     city: pindata[0]?.taluk
    //   })
    // }

  }

  emailFormValue(){
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
    })
  }

  otpForm(){
    this.verifyotpForm = this.fb.group({
      otp: ["", [Validators.required]],
      emails: ['', [Validators.required, Validators.email, Validators.maxLength(30)]]
    })

  }


  emailVerifyMethod(){
  
   
    this.resendflg=false
    let data = this.emailForm.value;
   //
    this.verifyotpForm.get('emails').setValue(data.email);
    if(data.email)
    {
      this.emaildisable=false;
      this.verifyotpForm.get('emails').setValue(data.email);
    }
    let paylod = {
     email:data.email,
     id: this.user_id
    }
    
    // console.log(this.emailForm.value);
    this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.OTP_EMAIL_REGISTER,paylod).subscribe((res)=>{
      // console.log(res);
      if(res){
        this.otpshow = true;
        this.toasterService.Success(res.message); 
        this.changemail = true;
      }
      else{
     // this.toasterService.Error(res.error);  
      console.log("yesss", this.emaildisable)
      this.emaildisable=false
     // this.emailForm.reset();
      }
       
    },error =>{
      // console.log(error);
      this.toasterService.Error("server error",error);  

    })
  }


  changeEmailMethod(){
    this.emailForm.reset();
    this.otpshow=false;
    this.resendflg=true;
    this.emaildisable=false
  }


  otpVerifyMethod(){
    // alert("otp verified");
    let data = this.verifyotpForm.value;
    // console.log(data);
    let Otp = this.verifyotpForm.value.otp;
    this.apiHandlerService.apiGet(API.AUTH_ENDPOINTS.VERIFY_EMAIL+'/'+Otp).subscribe((res)=>{
      if(res){
        this.toasterService.Success(res.message); 
        let userdatas=JSON.parse(localStorage.getItem('userData'))           
       // let newvalue=res.data.valid_account;
        userdatas.data.email = this.emailForm.value.email;
        userdatas.data.email_verification="verified"

   localStorage.setItem("userData",JSON.stringify(userdatas)); 
   
        // this.gstform = true;
        // this.otpshow = true;  
     const dailog = this.dailog.open(KycdilogformComponent);
    dailog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

      }
    },error =>{
      // console.log(error);
      this.toasterService.Error("server error",error);  

    })
  }



  
  createForm() {
    this.addressForm = this.fb.group({
      gst_no: ['', [Validators.required, Validators.pattern('^([a-zA-Z0-9]{15,15})*$')]],
      business_name: ["", [Validators.required, Validators.pattern('^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.]+$')]],
      person_name: ["", [Validators.required, Validators.pattern('^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.]+$')]],
      address1: ["", [Validators.required]],
      state: ["", [Validators.required]],
      city: ["", [Validators.required]],
      pincode: ["", [Validators.required,Validators.maxLength(6), Validators.minLength(5), Validators.pattern('^[1-9][0-9]{5}$')]]
    
      // pincode: ["", [Validators.required, Validators.minLength(5),
      // Validators.maxLength(6), Validators.pattern("[0-9]{6}")]]

    });
  }  
  countryList() {
    this.connectLoader = true
    this.user.countryList().subscribe((response: any) => {
      if (response.success) {
        this.country_list = response.data.rows;
        this.connectLoader = false;
        this.filteredCountries.next(this.country_list.slice());
        this.countryFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCountries();
          });
      }
      else {
        this.toasterService.Error(response.message);
        this.connectLoader = false;
      }
    })
  }

  private filterCountries() {
    if (!this.country_list) {
      return;
    }
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountries.next(this.country_list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCountries.next(
      this.country_list.filter(
        countries => countries.country.toLowerCase().indexOf(search) > -1
      )
    );
  }

  countryChange(e) {
    this.stateList(e.value);
  }

  stateList(id) {
    this.connectLoader = true
    this.user.stateList(id).subscribe((response: any) => {
      if (response.success) {
        this.StateList = response.data.rows;
        this.connectLoader = false;
        this.filteredStates.next(this.StateList.slice());

        this.stateFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterStates();
          });
      }
      else {
        this.toasterService.Error(response.message);
        this.connectLoader = false;
      }
    })
  }

  private filterStates() {
    if (!this.StateList) {
      return;
    }
    let search = this.stateFilterCtrl.value;
    if (!search) {
      this.filteredStates.next(this.StateList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStates.next(
      this.StateList.filter(
        states => states.state.toLowerCase().indexOf(search) > -1
      )
    );
  }

  stateChange(e) {
    this.cityList(e.value);
  }

  cityList(id) {
    this.connectLoader = true
    this.user.cityList(id).subscribe((response: any) => {
      if (response.success) {
        this.CityList = response.data.rows
        this.connectLoader = false;
        this.filteredCities.next(this.CityList.slice());

        this.cityFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCities();
          });
      }
      else {
        this.toasterService.Error(response.message);
        this.connectLoader = false;
      }
    })
  }

  private filterCities() {
    if (!this.CityList) {
      return;
    }
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCities.next(this.CityList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCities.next(
      this.CityList.filter(
        cities => cities.city.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getDeliveryAddress(user_id) {
    this.user.getAddressList(user_id).subscribe((response: any) => {
      if (response.success) {
        if (response.data.rows.length > 0) {
          this.addressList = response.data.rows;
          this.addressList.forEach((element, i) => {
            if (element.is_billing === "yes") {
              this.addressForm.get('address1').setValue(element.address_line_1);
              this.addressForm.get('city').setValue(element.city_id.toString());
              this.stateList(this.addressForm.value.country);
              this.addressForm.get('person_name').setValue(element.title);
              this.addressForm.get('pincode').setValue(element.pincode);
              this.addressForm.get('state').setValue(element.state_id.toString());
              this.cityList(this.addressForm.value.state);
              this.addressForm.controls['person_name'].disable();
              this.addressForm.controls['address1'].disable();
              this.addressForm.controls['state'].disable();
              this.addressForm.controls['city'].disable();
              this.addressForm.controls['pincode'].disable();
              this.addressStatus = true;
            }
          });
          let d = this.addressList.filter(function (item) {
            return item.is_billing === "yes";
          });
          if (d.length > 0) {
            this.DialogService.setBilling(d[0]);
            this.getKycDetails();
            this.getBusinessName();
          } else {
            this.DialogService.setBilling('');
            this.getKycDetails();
            this.getBusinessName();
          }
        } else {
          this.getKycDetails();
          this.getBusinessName();
        }
      }
      else {
        this.toasterService.Error(response.message);
      }
    })
  }

  getBusinessName() {
    this.apiHandlerService.apiGet(API.QUEST_ENDPOINTS.GET_BUSINESS_PROFILE).pipe().subscribe(
      {
        next: data => {
         // console.log(data.data)
          if (data.data) {
            if (data.data.reseller_profile !=null) {
              this.business_name = (data.data.reseller_profile.business_name)?(data.data.reseller_profile.business_name):"";
              this.addressForm.get('business_name').setValue(data.data.reseller_profile.business_name);
              this.addressForm.controls['business_name'].disable();
            }
            // else{
            //   this.business_name= ""
            // }
          }
        },
        error: (err: any) => {

        }
      })
  }

  getKycDetails() {
    this.apiHandlerService.apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS).pipe().subscribe(
      {
        next: data => {
          // console.log("fff",data.data)
          if (data.data != null) {
            this.kycFormData = data.data;

            this.getBusinessKYCDetail(this.kycFormData);

            if (data.data.is_business_kyc_update_allowed === 'no' && data.data.gst_no != null) {
              this.addressForm.controls['gst_no'].disable();
            }

            if (data.data.gst_status === 'approve') {
              this.addressForm.controls['gst_no'].disable();
            }

            if (data.data.business_kyc === 'yes') {
              this.DialogService.setKYC(data.data);
              if (JSON.parse(localStorage.getItem('billing'))) {
                // this.router.navigate(['prefered-products']); 
              } else {
              }
            } else {
              this.DialogService.setKYC(data.data);
              // this.toasterService.Success('Your profile is under approval, You will receive a confirmation email soon.');
              // this.router.navigate(['prefered-products']);
            }
          }
          else {
            this.kycFormData = null;
          }
        },
        error: err => this.Error
      }
    )
    if (this.Error === undefined) {
      this.DialogService.setKYC('');
    }
  }

  handleSubmit() {
    // console.log(this.addressForm.value);

    if (this.addressStatus == true) {
      this.updateBusinessProfile();
      this.handleSubmitSecond();
    } else {
      this.connectLoader = true;
      let address_data = {
        //'business_name': this.addressForm.value.business_name,
        'business_name': this.addressForm.value.business_name || this.business_name,
        'title': this.addressForm.value.person_name,
        'address_line_1': this.addressForm.value.address1,
        'address_line_2': '',
        'pincode': this.addressForm.value.pincode,
        'is_default': 'no',
        'city_id': this.addressForm.value.city,
        'state_id': this.addressForm.value.state,
        'country_id': 1,
      };
      this.isProcessing = true;
      let userData = this.localStorage.fetchData();
      this.user.createBillingAddress(userData["data"].id, address_data).subscribe({
        next: result => {
          if (result["message"]) {
            this.getDeliveryAddress(userData["data"].id);
            this.updateBusinessProfile();
          } else {
            this.toasterService.Error(result["message"]);
          }
          this.isProcessing = false;
        },
        error: err => {
          this.toasterService.Error(err);
          this.isProcessing = false;
        },
        complete: () => {
          this.isProcessing = false;
        }
      });
    }
  }

  updateBusinessProfile() {
    this.isLoginProcessing = true;
    const uploadData3 = new FormData();
    if (this.addressForm.value.business_name) {
      uploadData3.append('business_name', this.addressForm.value.business_name);
    } else {
      uploadData3.append('business_name', this.business_name);
    }

    this.apiHandlerService.apiPost(API.QUEST_ENDPOINTS.UPDATE_BUSINESS_PROFILE + '/' + this.user_id,
      uploadData3, {}, { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          if (result.message) {
            this.getBusinessName();
            this.handleSubmitSecond();
          } else {
            let msg = 'Process failed';
            this.toasterService.Error(msg);
          }
          this.isLoginProcessing = false;
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

  updateKycDetails() {
    this.addressForm.reset();
    const dailog = this.dailog.open(KycdilogformComponent);
    dailog.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });

  }



  handleSubmitSecond() {
    this.isLoginProcessing = true;
    const uploadData2 = new FormData();
    uploadData2.append('gst_no', this.addressForm.value.gst_no);
    this.apiHandlerService.apiPost(API.QUEST_ENDPOINTS.UPLOAD_BUISNESSKYC, uploadData2, {},
      { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          console.log("data",result)
          if (result.message) {
            this.getKycDetails();
          } else {
            let msg = 'Process failed';
            this.toasterService.Error(msg);
          }
          this.isLoginProcessing = false;
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

  getBusinessKYCDetail(kycFormData) {
    if (kycFormData.gst_no) {
      this.addressForm.get('gst_no').setValue(kycFormData.gst_no);
    }
  }
}
