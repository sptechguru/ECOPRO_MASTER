import { Component, EventEmitter, Input, OnInit, Output, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators ,FormControl} from '@angular/forms';
import { error_msg } from 'app/shared/constants/consts';
import { UserData, StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from 'app/front/front-header/dialog/dialog.component';
import { FrontHeaderComponent } from 'app/front/front-header/front-header.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { tap } from 'rxjs/operators';
import { DialogService } from 'app/front/front-header/dialog/dialog.service';
import { UserService } from 'app/shared/services/user.service';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { UpdateEmailComponent } from '../update-email/update-email.component';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
  providers: [FrontHeaderComponent, ConfirmationDialogHandlerService]
})

export class AuthSigninComponent implements OnInit {
  @Output() redirect:EventEmitter<any> = new EventEmitter();
  loginForm: FormGroup;
  loginFormWithPhone:FormGroup;
  optLoginForm:FormGroup;
  errorMessages = error_msg;
  loginForms= true;
  signupForm= true;
  forgotForm= false;
  passwordHide = true;
  hide = true;
  emailForm:boolean = true;
  initialFormData = {
    email: '',
    password: ''
  };
  phoneFormData = {
    tel: ''
  };
  phoneCtrl;
  otpCtrl;
  isLoading:boolean = false;
  userLocalData: UserData;
  AuthorizationCode:string = '';
  optForm:boolean = false;
  otpFormData = {
    otp: ''
  };
  isLoginProcessing = false;
  addressList: any = [];


  constructor(public matDialog: MatDialog,public translate: TranslateService,
    private router: Router,private localStorage: StorageAccessorService,
    private fb: FormBuilder,private apiHandlerService: ApiHandlerService,
    private toasterService: ToasterService,
    public dialog: FrontHeaderComponent,
    public dialogRef: MatDialogRef<AuthSigninComponent>,
    public DialogService: DialogService,
    private user : UserService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService, 
    private elementRef: ElementRef
  ) {
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');
    this.phoneCtrl = this.fb.control('', [Validators.required,Validators.pattern(/^\d+$/), Validators.min(999999999)]);
    this.otpCtrl = this.fb.control('', [Validators.required,Validators.pattern(/^\d+$/), Validators.max(999999)]);
  }

  ngOnInit() {
    this.createForm();
    this.retrieveLoginInfo();
  }

  toggleForm(opt){
    if(opt == 'phone'){ 
      this.emailForm = false;
    }else if(opt == 'otp'){ 
      this.optForm = false;
      this.emailForm = false;
    }else{
      this.optForm = false;
      this.emailForm = true;
    }
  }
  
  showSignup() {
    this.dialog.showSignup();
  };
  
  switchLang(lang: string) {
    this.translate.use(lang);
  }

  openForgotPass(data) {
    this.dialogRef.close();
    this.matDialog.open(ForgotPasswordComponent,data);
  }
  
  retrieveLoginInfo() {
    this.userLocalData = this.localStorage.fetchData();
    if (this.userLocalData) {
      const formData = this.userLocalData.loginForm;
      if (formData) {
        this.email.setValue(formData.email);
        this.password.setValue(formData.password);
        this.rememberMe.setValue(true);
        this.loginForm.updateValueAndValidity();
      }
    }
  }

  saveLoginInfo() {
    this.userLocalData = Object.assign({}, this.userLocalData, this.localStorage.fetchData());
    let userData: UserData | object = this.userLocalData
      ? this.userLocalData
      : {};
    if (this.rememberMe.value) {
      userData = Object.assign({}, userData, {
        loginForm: {
          email: this.email.value,
          password: this.password.value
        }
      });
    } else {
      userData = Object.assign({}, userData, {
        loginForm: {
          email: '',
          password: ''
        }
      });
    }
    this.localStorage.storeData(userData);
  }

  saveToken(serverResponse: any) {
    const token = serverResponse.data.access_token;
    if (token) {
      this.localStorage.storeToken(token);
    }
  }

  close() {
    this.dialogRef.close();
  }

  storeDataInLocal(data) {
    if (data) {
      try {
        const userInfo = this.localStorage.fetchData().loginForm;
        this.localStorage.deleteData();
        this.localStorage.storeData(
          Object.assign({}, { loginForm: userInfo }, data)
        );
      } catch (ex) {
        this.localStorage.deleteData();
        this.localStorage.storeData(data);
      }
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [
        this.initialFormData.email,
        Validators.compose([
          Validators.required,
          // Validators.pattern(
          //   /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          // )
        ])
      ],
      password: [
        this.initialFormData.password,
        Validators.compose([Validators.required,
        ])
      ],
      remeberMe: false
    });
    this.loginFormWithPhone = this.fb.group({
      tel: this.phoneCtrl
    });
    this.optLoginForm = this.fb.group({
      otp: this.otpCtrl
    });
  }

  handleSubmit() {
    if (this.loginForm.valid && !this.isLoginProcessing) {
      this.isLoginProcessing = true;
      const formVal = this.loginForm.value;
      this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.LOGIN_IN, { email: formVal.email, password: formVal.password, device_type: 'web', device_id: '' }).subscribe({
        next: result => {
          if (result.data && result.data.access_token) {
            sessionStorage.setItem('banner','true');
            // console.log(result);
            this.storeDataInLocal(result);
            this.saveToken(result);
            this.toasterService.Success('Login Successfully ');
            setTimeout(() =>{
            this.router.navigate(['prefered-products']);
            },5000)
            this.saveLoginInfo(); 
            this.getKycDetails();
            this.close();
          } else {
            this.redirect.emit(result?.data);
            let msg = (result.message) ? result.message : 'Invalid Credentialssss';
            this.toasterService.Error(msg);
          }
        },
        error: err => {
          this.isLoginProcessing = false;
          this.loginForm.reset();
          this.toasterService.Error("Invalid email id or password");
        },
        complete: () => {
          this.isLoginProcessing = false;
        }
      });
    }
  }
  
  handlePhoneSubmit(){
    if (this.loginFormWithPhone.valid) {
      this.isLoading = true;
      const formVal = this.loginFormWithPhone.value;
      this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.OTPLOGIN_IN, { phone_number: formVal.tel,}).subscribe({
        next: result => {
          if (result.data && result.success) {
            localStorage.setItem('auth_code', result.data.authoriesd_code);
            this.optForm = true;
            this.toasterService.Success(result.message);
          } else {
            let msg = (result.message) ? result.message : 'Invalid Credentialssss';
            this.loginForm.reset();
            this.toasterService.Error(msg);
          }
        },
        error: err => {
          this.toasterService.Error("Phone number does not exist");
        },
        complete: () => {
          this.isLoginProcessing = false;
          this.isLoading = false;
        }
      });
    }
  }

  handleOtpSubmit(){
    if (this.optLoginForm.valid) {
      this.isLoading = true;
      this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.VERIFY_OTP, 
        {otp_code: this.optLoginForm.value.otp, device_type: 'web', device_id: ''}).subscribe({
        next: result => {
          localStorage.removeItem('auth_code');
          if (result.data && result.data.access_token) {
            sessionStorage.setItem('banner','true');
            // console.log(sessionStorage.getItem('banner'));
            this.storeDataInLocal(result);
            this.saveToken(result);
            this.saveLoginInfo();
            // this.getQuestionarie(result.data);
            this.toasterService.Success('Login Successfull');
            this.close();
            this.router.navigate(['prefered-products']);
          }else {
            let msg = (result.message) ? result.message : 'Invalid Credentialssss';
            this.loginForm.reset();
            this.toasterService.Error(msg);
            localStorage.removeItem('auth_code');
          }
        },
        error: err => {
          let msg = (err.error && err.error.message) ? err.error.message : 'Invalid Credentials';
          this.toasterService.Error(msg);
          localStorage.removeItem('auth_code');
        },
        complete: () => {
          this.isLoginProcessing = false;
          this.isLoading = false;
        }
      });
    }
  }

  /* Getters for accessing reactive form elements are defined below */

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('remeberMe');
  }

  getQuestionarie(userData){    
   // this.apiHandlerService.apiGet(API.QUEST_ENDPOINTS.GET_QUISTIONSRIES).pipe(
     // tap({
      //  next:data=>{
        //  console.log(data)
         // if(data.data){
          
            this.localStorage.KycAndQuesCheck = {questinarie : true};
            this.user.getAddressList(userData.id).subscribe((response:any)=>{
            //  console.log(response)
              if(response.success){
                if(response.data.rows.length>0){
                  this.addressList = response.data.rows;
                  let d = this.addressList.filter(function (item) {
                    return item.is_billing === "yes";
                  });
                  if(d.length>0){
                    this.getKycDetails2();
                  }else{
                    this.confirmationDialogHandlerService.openDialog({
                      question: 'Kindly Input Your Billing Address (Highly Recommended)',
                      confirmText: 'Continue',
                      cancelText: 'Skip'
                    }).subscribe((result) => {
                      if(result){
                        this.getDeliveryAddress(userData);
                      }else{
                        this.getKycDetails2();
                      }
                    }); 
                  }
                }
                else{
                  this.confirmationDialogHandlerService.openDialog({
                    question: 'Kindly Input Your Billing Address (Highly Recommended)',
                    confirmText: 'Continue',
                    cancelText: 'Skip'
                  }).subscribe((result) => {
                    if(result){
                      this.getDeliveryAddress(userData);
                    }else{
                      this.getKycDetails2();
                    }
                  }); 
                }
              }
              else{
                this.toasterService.Error(response.message);
              }
              if(JSON.parse(localStorage.getItem('cartData'))){
                localStorage.removeItem('cartData')
              };
              this.router.navigate(['prefered-products']);
            })
         // }
         /* else{
            this.DialogService.setKYC('');
            if(JSON.parse(localStorage.getItem('cartData'))){
              localStorage.removeItem('cartData')
            };
            this.router.navigate(['ques/questions']);
          }*/  
       // },
       // error:err=> console.log(err)  
     // })
   // ).subscribe()
  }

  getDeliveryAddress(userData){
    this.user.getAddressList(userData.id).subscribe((response:any)=>{
      if(response.success){
        if(response.data.rows.length>0){
          this.addressList = response.data.rows;
          let d = this.addressList.filter(function (item) {
            return item.is_billing === "yes";
          });
          if(d.length>0){
            this.DialogService.setBilling(d[0]);
            this.getKycDetails();
          }else{
            this.DialogService.setBilling('');
            this.getKycDetails();
          }
        }else{
          this.DialogService.setBilling('');
          this.getKycDetails();
        }
      }
      else{
        this.toasterService.Error(response.message);
      }
    })
  }

  getKycDetails(){
    this.apiHandlerService.apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS).pipe(
      tap({
        next:data=>{
          if(data){
            if(data.data && data.data.gst_status=='reject')
            {
             
              this.toasterService.Error("Your GST number is rejected. please contact Ek Matra Team.")
              this.router.navigate(['home']);
              localStorage.removeItem("userData");

            }
            else if(data.data && data.data.business_kyc === 'yes'){
              this.localStorage.KycAndQuesCheck = {kyc : true}
              this.DialogService.setKYC(data.data);
              if(JSON.parse(localStorage.getItem('billing'))){
                this.router.navigate(['prefered-products']); 
              }else{
                // this.router.navigate(['kyc/kycform']);
              }
            } else{
              this.DialogService.setKYC('');
              // this.router.navigate(['kyc/kycform']);
            } 
          } 
        },
        error:err=> {
          this.DialogService.setKYC('');
          this.router.navigate(['kyc/kycform']);
        }  
      })
    ).subscribe()
  }

  getKycDetails2(){
    this.apiHandlerService.apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS).pipe(
      tap({
        next:data=>{
          if(data){
          //  console.log(data)
            if(data.data && data.data.business_kyc === 'yes'){
              this.localStorage.KycAndQuesCheck = {kyc : true}
              this.DialogService.setKYC(data.data);
              this.DialogService.setBilling('skip');
              this.router.navigate(['prefered-products']); 
            } else{
             // this.DialogService.setKYC('');
              this.router.navigate(['home']); 
             // this.router.navigate(['kyc/kycform']);
            } 
          } 
        },
        error:err=> {
          this.DialogService.setKYC('');
          this.router.navigate(['kyc/kycform']);
        }  
      })
    ).subscribe()
  }
}
