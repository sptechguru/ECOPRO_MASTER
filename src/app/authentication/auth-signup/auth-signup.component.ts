import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { FrontHeaderComponent } from "app/front/front-header/front-header.component";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { UserService } from "app/shared/services/user.service";
import { error_msg } from "app/shared/constants/consts";
import { ToasterService } from "app/shared/services/toaster.service";
import { ApiHandlerService } from "app/shared/services/api-handler.service";
import { HttpClient } from "@angular/common/http";
import { API } from "app/shared/constants/endpoints";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  StorageAccessorService,
  UserData,
} from "app/shared/services/localstorage-accessor.service";
import { Overlay, BlockScrollStrategy } from "@angular/cdk/overlay";
import { MAT_SELECT_SCROLL_STRATEGY } from "@angular/material/select";
import { environment } from "environments/environment";
import { DialogService } from "app/front/front-header/dialog/dialog.service";
import { AstMemoryEfficientTransformer } from "@angular/compiler";
import { tap } from "rxjs/operators";
import { ConfirmationDialogHandlerService } from "app/shared/components/confirmation-dialog/confirmation-dialog-handler.service";
import { UpdateEmailComponent } from "../update-email/update-email.component";
import { KycdilogformComponent } from "app/front/kycdilogform/kycdilogform.component";

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@Component({
  selector: "app-auth-signup",
  templateUrl: "./auth-signup.component.html",
  styleUrls: ["./auth-signup.component.scss"],
  providers: [
    FrontHeaderComponent,
    ConfirmationDialogHandlerService,
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class AuthSignupComponent implements OnInit {
  @Input() data: any;
  @Output() newItemEvent = new EventEmitter<boolean>();
  form: FormGroup;
  loginForms = true;
  signupForms = true;
  forgotForm = false;
  hide = true;
  response: any = {};
  submitted = false;
  loading = false;
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  files = [];
  signupForm: FormGroup;
  emailOTPForm: FormGroup;
  cutomerForm: FormGroup;
  phoneForm: FormGroup;
  phoneOtpForm: FormGroup;
  emailChangeForm: FormGroup;
  phoneChangeForm: FormGroup;
  errorMessages = error_msg;
  isLoginProcessing = false;
  check = false;
  logo: any;
  passwordHide = true;
  privacyUrl: any;
  termsUrl: any;
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;
  step6: boolean = false;
  email_id: any;
  user_id: any;
  userLocalData: UserData;
  addressList: any = [];
  verify_email_name: any;
  verify_phone_name: any;
  otpshow: boolean = false;
  phonum: boolean = true;
  customer: boolean = false;
  users_id: any = "";
  users_details: any;
  access_token:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public id: any,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    public translate: TranslateService,
    private userservice: UserService,
    private commModel: DialogService,
    private router: Router,
    public dialog: FrontHeaderComponent,
    private toasterService: ToasterService,
    private apiHandlerService: ApiHandlerService,
    private dialogRef: MatDialogRef<AuthSignupComponent>,
    private localStorage: StorageAccessorService,
    private user: UserService,
    public DialogService: DialogService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    public dailog: MatDialog
  ) {
    translate.addLangs(["en", "hi"]);
    translate.setDefaultLang("en");
  }

  public registerForm: FormGroup;
  registrationForm: any;

  ngOnInit() {
    
    this.createForm();
    this.createEmailOtpForm();
    this.createPhoneNumberForm();
    this.createPhoneOtpForm();
    this.changeEmailForm();
    this.changePhoneForm();
    this.privacyUrl =
      environment.AssetsUrl + "/pdf/ek-matra-privacy-policy.pdf";
    this.termsUrl = environment.AssetsUrl + "/pdf/ek-matra-terms-of-use.pdf";

    if (this.data) {
      this.user_id = this.data.id;
      if (this.data.email_verification === "pending") {
        this.signupForm.patchValue({ email: this.data.email });
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
        this.step4 = false;
        return;
      }
      if (this.data.phone_number === null) {
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;
        this.step4 = false;
        return;
      }
      if (this.data.phone_verification === "pending") {
        this.phoneForm.patchValue({ phone_number: this.data.phone_number });
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
        this.step4 = true;
        return;
      }
    }
    // let userData = this.localStorage.fetchData();
    // this.users_id = userData["data"].id;
    // console.log(this.users_id);

    this.users_details = localStorage.getItem("userData");
    // console.log(this.users_details);

    if (this.users_details != null) {
      let newkycdd = JSON.parse(this.users_details);
      this.users_id = newkycdd.data.id;
      // console.log(this.users_id);
    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
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

  createEmailOtpForm() {
    this.emailOTPForm = this.fb.group({
      email_otp: ["", [Validators.required]],
    });
  }

  createPhoneNumberForm() {
    this.phoneForm = this.fb.group({
      phone_number: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          Validators.minLength(10),
        ],
      ],
    });
  }

  createPhoneOtpForm() {
    this.phoneOtpForm = this.fb.group({
      otp_code: ["", [Validators.required]],
    });
  }

  changeEmailForm() {
    this.emailChangeForm = this.fb.group({
      email_change: ["", [Validators.required, Validators.email]],
    });
  }

  changePhoneForm() {
    this.phoneChangeForm = this.fb.group({
      phone_change: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          Validators.minLength(10),
        ],
      ],
    });
  }

  showLogin() {
    this.dialog.showLogin();
  }

  close() {
    this.dialogRef.close();
  }

  checkedPrivacy(e) {
    if (e.checked === true) {
      this.check = true;
    } else {
      this.check = false;
    }
  }

  onFileChange(fileList: any) {
    const fileUpload = this.fileUpload.nativeElement;
    const file = fileUpload.files[0];
    this.signupForm.patchValue({
      business_logo: file,
    });
    this.signupForm.get("business_logo").updateValueAndValidity();
  }
  closemodel(){

  }

  handleSubmit() {
    const uploadData = new FormData();
    this.email_id = this.signupForm.value.email;
    this.verify_email_name = this.signupForm.value.email;
    uploadData.append("first_name", this.signupForm.value.first_name);
    uploadData.append("email", this.signupForm.value.email);
    uploadData.append("password", this.signupForm.value.password);
    if (this.check === true) {
      this.isLoginProcessing = true;
      this.apiHandlerService
        .apiPost(
          API.AUTH_ENDPOINTS.SIGN_UP,
          uploadData,
          {},
          { contentType: { isFormDataContent: true } }
        )
        .subscribe({
          next: (result) => {
            if (result.message) {
              this.step1 = false;
              this.step2 = true;
              this.step3 = false;
              this.step4 = false;
              this.user_id = result.data.id;
              this.verify_email_name = result.data.email;
              // this.toasterService.Success(result.message);
            } else {
              let msg = result.message ? result.message : "Unable to signup.";
              this.signupForm.reset();
              this.toasterService.Error(msg);
            }
            this.isLoginProcessing = false;
          },
          error: (err) => {
            let msg = err.error && err.error.message ? err.error.message : err;
            if (err == "Email already in use") {
            }
            this.toasterService.Error(err);
            this.isLoginProcessing = false;
          },
          complete: () => {
            this.isLoginProcessing = false;
          },
        });
    } else {
      this.toasterService.Error(
        "Please accept Terms of Use and Privacy Policy"
      );
    }
  }

  emailOtpSubmit() {
    this.isLoginProcessing = true;
    let Otp = this.emailOTPForm.value.email_otp;
    this.apiHandlerService
      .apiGet(API.AUTH_ENDPOINTS.VERIFY_EMAIL + "/" + Otp)
      .subscribe({
        next: (result) => {
          if (result.message) {
            this.step1 = false;
            this.step2 = false;
            this.step3 = true;
            this.step4 = false;
            this.toasterService.Success(result.message);
            this.user_id = result.data.id;
          } else {
            let msg = result.message ? result.message : "Process failed.";
            this.signupForm.reset();
            this.toasterService.Error(msg);
          }
          this.isLoginProcessing = false;
        },
        error: (err) => {
          let msg = err.error && err.error.message ? err.error.message : err;
          this.toasterService.Error(err);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        },
      });
  }

  resendVerification(str: "email" | "phone") {
    this.isLoginProcessing = true;
    let email = "";
    let phone = "";
    if (!this.verify_email_name) {
      email = this.signupForm.controls["email"].value;
    } else if (this.verify_email_name) {
      email = this.verify_email_name;
    }

    if (!this.verify_phone_name) {
      phone = this.phoneForm.controls["phone_number"].value;
    } else if (this.verify_phone_name) {
      phone = this.verify_phone_name;
    }

    let body = {
      email: email,
      phone_number: phone,
      verification_type: str,
    };
    let Otp = this.emailOTPForm.value.email_otp;
    this.apiHandlerService
      .apiPost(
        API.AUTH_ENDPOINTS.RESEND_EMAIL,
        body,
        {},
        { contentType: { isFormDataContent: false } }
      )
      .subscribe({
        next: (result) => {
          if (result.message) {
            this.toasterService.Success(result.message);
          } else {
            let msg = result.message ? result.message : "Process failed.";
            this.signupForm.reset();
            this.toasterService.Error(msg);
          }
          this.isLoginProcessing = false;
        },
        error: (err) => {
          let msg = err.error && err.error.message ? err.error.message : err;
          this.toasterService.Error(err);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        },
      });
  }

  phoneSubmitMethod() {
    localStorage.removeItem("kyc");
    localStorage.clear();
    let data = this.phoneForm.value;
    // console.log(this.phoneForm.value.phone_number);
    this.otpshow = true;
    this.phonum = false;
    this.newItemEvent.emit(this.otpshow);
    let paylod = {
      phone_number: data.phone_number,
      resend : "no"
    };
    this.apiHandlerService
      .apiPost(API.AUTH_ENDPOINTS.OTP_SIGNUP, paylod)
      .subscribe(
        (res) => {
          // console.log(res);
          if (res.message) {
            this.toasterService.Success(res.message);
          } else {
            this.toasterService.Error(res.error);
          }
        },
        (error) => {
          // console.log(error);
          this.toasterService.Error("server error", error);
        }
      );
  }

  phoneOtpMethod() {
    // alert(" mobile number for otp");
    let data = this.phoneOtpForm.value;
    // console.log(this.phoneOtpForm.value);
    this.otpshow = true;
    this.phonum = false;
    let paylod = {
      otp_code: data.otp_code,
      device_id: "",
      device_type: "web",
    };
    // console.log(this.emailForm.value);
    this.apiHandlerService
      .apiPost(API.AUTH_ENDPOINTS.VERIFY_OTP_LOGIN, paylod)
      .subscribe(
        (res) => {
          // console.log(res.data.id);
          this.users_id = res.data.id;
          this.access_token = res.data.access_token;
          let token = localStorage.setItem('tokens',res.data.access_token);


          if (res.data) {
            this.storeDataInLocal(res);
            this.saveToken(res);
            this.saveLoginInfo();
            this.toasterService.Success(res.message);
          
              this.close();
              this.router.navigate(["prefered-products"]);
           this.otpshow = false;
           // this.customer = true;
          } else {
            this.toasterService.Error(res.error);
          }
        },
        (error) => {
          console.log(error);
          this.toasterService.Error("server error", error);
        }
      );
  }

  cutomerSubmit() {
    // console.log(this.cutomerForm.value);
    // console.log("data id ", this.users_id);
    let data = this.cutomerForm.value;
    this.otpshow = false;
    this.phonum = false;
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
            this.router.navigate(["prefered-products"]);
            // const dailog = this.dailog.open(KycdilogformComponent);
            // dailog.afterClosed().subscribe(result => {
            //   console.log(`Dialog result: ${result}`);
            // });  
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

  phoneSubmit() {
    this.isLoginProcessing = true;
    this.verify_phone_name = this.phoneForm.value.phone_number;
    let body = {
      phone_number: this.phoneForm.value.phone_number,
    };
    let Otp = this.emailOTPForm.value.email_otp;
    this.apiHandlerService
      .apiPost(
        API.AUTH_ENDPOINTS.Otp_Register + "/" + this.user_id,
        body,
        {},
        { contentType: { isFormDataContent: false } }
      )
      .subscribe({
        next: (result) => {
          if (result.message) {
            this.step1 = false;
            this.step2 = false;
            this.step3 = false;
            this.step4 = true;
            this.toasterService.Success(result.message);
          } else {
            let msg = result.message ? result.message : "Process failed.";
            this.signupForm.reset();
            this.toasterService.Error(msg);
          }
          this.isLoginProcessing = false;
        },
        error: (err) => {
          let msg = err.error && err.error.message ? err.error.message : err;
          this.toasterService.Error(err);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        },
      });
  }

  phoneOTPSubmit() {
    this.isLoginProcessing = true;
    let body = {
      otp_code: this.phoneOtpForm.value.phone_otp,
      device_type: "web",
      device_id: "",
    };
    let Otp = this.emailOTPForm.value.email_otp;
    this.apiHandlerService
      .apiPost(API.AUTH_ENDPOINTS.VERIFY_OTP, body)
      .subscribe({
        next: (result) => {
          if (result.data) {
            this.storeDataInLocal(result);
            this.saveToken(result);
            this.saveLoginInfo();
            //  this.getQuestionarie(result.data);
            this.toasterService.Success("Your Registration is Successfully.");
            this.router.navigate(["prefered-products"]);
            //this.toasterService.Success('Thanks for signup, an email verification link has been sent to verify your email address.');
            this.close();
          } else {
            let msg = result.message ? result.message : "Process failed.";
            this.signupForm.reset();
            this.toasterService.Error(msg);
          }
          this.isLoginProcessing = false;
        },
        error: (err) => {
          let msg = err.error && err.error.message ? err.error.message : err;
          this.toasterService.Error(err);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        },
      });
  }

  /*--------------------- Change Email -----------------------*/
  changeEmailID() {
    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.step4 = false;
    this.step5 = true;
    this.step6 = false;
    //this.dialogRef.close();
    //this.matDialog.open(UpdateEmailComponent, data);
  }

  emailUpdate() {
    this.verify_email_name = this.emailChangeForm.value.email_change;
    let uploadData =
      "update_type=email&email=" + this.emailChangeForm.value.email_change;
    this.updateFunction(uploadData, "email");
  }

  /*--------------------- Change Phone -----------------------*/

  changePhone() {
    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.step4 = false;
    this.step5 = false;
    this.step6 = true;
  }

  phoneUpdate() {
    this.verify_phone_name = this.phoneChangeForm.value.phone_change;
    let uploadData =
      "update_type=phone&phone_number=" +
      this.phoneChangeForm.value.phone_change;
    this.updateFunction(uploadData, "phone");
  }

  updateFunction(data, type) {
    this.isLoginProcessing = true;
    this.apiHandlerService
      .apiPost2(
        API.AUTH_ENDPOINTS.UPDATE_PROFILE + "/" + this.user_id,
        data,
        {},
        { contentType: { isFormDataContent: false } }
      )
      .subscribe({
        next: (result) => {
          if (result.message) {
            if (type == "email") {
              this.step1 = false;
              this.step2 = true;
              this.step3 = false;
              this.step4 = false;
              this.step5 = false;
              this.step6 = false;
            }
            if (type == "phone") {
              this.step1 = false;
              this.step2 = false;
              this.step3 = false;
              this.step4 = true;
              this.step5 = false;
              this.step6 = false;
            }
            this.toasterService.Success(result.message);

            if (type == "phone") {
              alert("phome msg show..");
              this.router.navigateByUrl("/home");
            }
          }
          this.isLoginProcessing = false;
        },
        error: (err) => {
          let msg = err.error && err.error.message ? err.error.message : err;
          this.toasterService.Error(err);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        },
      });
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

  saveToken(serverResponse: any) {
    const token = serverResponse.data.access_token;
    if (token) {
      this.localStorage.storeToken(token);
    }
  }

  saveLoginInfo() {
    this.userLocalData = Object.assign(
      {},
      this.userLocalData,
      this.localStorage.fetchData()
    );
    let userData: UserData | object = this.userLocalData
      ? this.userLocalData
      : {};
    /* if (this.rememberMe.value) {
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
     }*/
    this.localStorage.storeData(userData);
  }

  // getQuestionarie(userData){
  //   this.apiHandlerService.apiGet(API.QUEST_ENDPOINTS.GET_QUISTIONSRIES).pipe(
  //    tap({
  //       next:data=>{
  //         if(data.data){
  //          this.localStorage.KycAndQuesCheck = { questinarie : true}
  //          this.user.getAddressList(userData.id).subscribe((response:any)=>{
  //           if(response.success){
  //             if(response.data.rows.length>0){
  //               this.addressList = response.data.rows;
  //               let d = this.addressList.filter(function (item) {
  //                 return item.is_billing === "yes";
  //               });
  //               if(d.length>0){
  //                 this.DialogService.setBilling(d[0]);
  //                 this.getKycDetails();
  //               }else{
  //                 this.DialogService.setBilling('');
  //                 this.getKycDetails();
  //               }
  //             }else{
  //               this.DialogService.setBilling('');
  //               this.getKycDetails();
  //             }
  //           }
  //           else{
  //             this.toasterService.Error(response.message);
  //           }
  //         })
  //         //  this.confirmationDialogHandlerService.openDialog({
  //         //   question: 'Kindly Input Your Billing Address (Highly Recommended)',
  //         //   confirmText: 'Continue',
  //         //   cancelText: 'Skip'
  //         // }).subscribe((result) => {
  //         //   if(result){
  //         //     this.getDeliveryAddress(userData);
  //         //   }else{
  //         //     this.getKycDetails2();
  //         //   }
  //         // });
  //         }else{
  //           this.DialogService.setKYC('');
  //           if(JSON.parse(localStorage.getItem('cartData'))){
  //             localStorage.removeItem('cartData')
  //           };
  //           // this.router.navigate(['ques/questions']);
  //           this.router.navigate(['home']);

  //         }
  //       },
  //       error:err=> console.log(err)
  //     })
  //   ).subscribe()
  // }

  getDeliveryAddress(userData) {
    this.user.getAddressList(userData.id).subscribe((response: any) => {
      if (response.success) {
        if (response.data.rows.length > 0) {
          this.addressList = response.data.rows;
          let d = this.addressList.filter(function (item) {
            return item.is_billing === "yes";
          });
          if (d.length > 0) {
            this.DialogService.setBilling(d[0]);
            this.getKycDetails();
          } else {
            this.DialogService.setBilling("");
            this.getKycDetails();
          }
        } else {
          this.DialogService.setBilling("");
          this.getKycDetails();
        }
      } else {
        this.toasterService.Error(response.message);
      }
    });
  }

  getKycDetails2() {
    this.apiHandlerService
      .apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS)
      .pipe(
        tap({
          next: (data) => {
            if (data) {
              if (data.data && data.data.business_kyc === "yes") {
                this.localStorage.KycAndQuesCheck = { kyc: true };
                this.DialogService.setKYC(data.data);
                this.DialogService.setBilling("skip");
                this.router.navigate(["prefered-products"]);
              } else {
                this.DialogService.setKYC("");
                this.router.navigate(["kyc/kycform"]);
              }
            }
          },
          error: (err) => {
            this.DialogService.setKYC("");
            this.router.navigate(["kyc/kycform"]);
          },
        })
      )
      .subscribe();
  }

  getKycDetails() {
    this.apiHandlerService
      .apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS)
      .pipe(
        tap({
          next: (data) => {
            if (data) {
              if (data.data && data.data.business_kyc === "yes") {
                this.localStorage.KycAndQuesCheck = { kyc: true };
                this.DialogService.setKYC(data.data);
                if (JSON.parse(localStorage.getItem("billing"))) {
                  this.router.navigate(["prefered-products"]);
                } else {
                  this.router.navigate(["kyc/kycform"]);
                }
              } else {
                this.DialogService.setKYC("");
                this.router.navigate(["kyc/kycform"]);
              }
            }
          },
          error: (err) => {
            this.DialogService.setKYC("");
            this.router.navigate(["kyc/kycform"]);
          },
        })
      )
      .subscribe();
  }
}
