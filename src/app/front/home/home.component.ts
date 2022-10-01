import {Component, OnInit, Injectable} from '@angular/core';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { DialogService } from '../front-header/dialog/dialog.service';
import { API } from 'app/shared/constants/endpoints';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'app/shared/services/user.service';
import { MatDialog} from '@angular/material/dialog';
import { OtpDialogComponent } from './otp-dialog/otp-dialog.component';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [OtpDialogComponent]
})
export class HomeComponent implements OnInit {
  customerSlide = {
    
    "dots": false,
    "arrow": true,
    "speed": 300,
    "autoplay": false,
    "autoplaySpeed": 2000,
    "infinite": false,
    "slidesToShow": 2,
    "slidesToScroll": 1,
    "touchMove": true,
    "draggable": true,
    responsive: [
      {
 
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      }
 
    }, 
    //   {
 
    //   breakpoint: 991,
    //   settings: {
    //     slidesToShow: 4,
    //   }
 
    // }, 
     {
 
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      }
 
    },
    {
 
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
      }
    },
    {
      breakpoint: 574,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
    // "centerMode": true,
    // "centerPadding": '60px',
  };
  // customerSlide = {
  //   "slidesToShow" : 4,
  //   "slidesToScroll": 1,
  //   "centerMode": true,
  //   "centerPadding": '100px',
  //   "dots": false,
  //   "autoplay":true,
  //   "arrows": true,
  //   "fade": true,
  //   "infinite": true,
  //   "swipeToSlide": true,
  //   // "mobileFirst": true,
    
  //   };

  slideBanner = {
    // "slidesToShow": 5,
    "slidesToScroll": 1,
    "dots": true,
    "autoplay":true,
    "arrows": false,
    "fade": true,
    "infinite": true,
    "swipeToSlide": true,
    "mobileFirst": true,
  };
  reviewSlider = {
    
    "dots": true,
    "arrow": false,
    "speed": 300,
    "autoplay": false,
    "autoplaySpeed": 2000,
    "infinite": false,
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "touchMove": true,
    "draggable": true,
    "centerMode": true,
    "centerPadding": '60px',
    
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: '0px',
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: '0px',
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '0px',
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '0px',
        }
      },
     
    ]
  };
   
  sliderImages: any;
  contactForm: FormGroup;
  contactForm1: FormGroup;
  contactForm2: FormGroup;
  loader: boolean;
  video_url: any;
  safeUrl: any;
  categoryList: any;
  default_image: any;
  users_details:any;
  user_id:any;
  isloging=false;
  

  public list = document.getElementById('main-body');
  constructor(private commModel: DialogService, private apiHandlerService: ApiHandlerService,
    private Router: Router, private fb: FormBuilder, private ToasterService: ToasterService,
    private sanitizer: DomSanitizer, private user: UserService,  public matDialog: MatDialog,
    private OtpDialogComponent: OtpDialogComponent,public dailog: MatDialog,private _api: ApiHandlerService,
    private localStorage: StorageAccessorService) {
    this.list.classList.add('home-body');
    //this.getSliderImage();
  }

  showSignup(){
    this.commModel.openSignupDialog().subscribe(data => {
    });
  }

  showLogin() {
    this.commModel.openLoginDialog().subscribe(data => {
    });
  }

  ngOnDestroy(): void {
    this.list.classList.remove('home-body');
    // console.log("ffgfff")
  }

  ngOnInit(){
    this.users_details = localStorage.getItem("userData");
    if(this.users_details)
    {
      this.Router.navigate(["prefered-products"]);
      this.isloging=false;
    }else
    {
      this.isloging=true;
    }
    
    this.getSliderImage();
    this.createForm();
    this.getCategoriesList();
    this.video_url = API.VIDEO_URL+'?muted=1&autoplay=false';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.video_url);
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE; 
    
  }
 
  getSliderImage(){
    this.apiHandlerService.apiGet(API.SLIDER.SLIDER_FILES+'?device_type=web').pipe().subscribe(
      {
        next:data=>{
          if(data["success"] = true){
            this.sliderImages = data.data["rows"];
          }
        },
        error: err => {
          this.ToasterService.Error(err);
        },
        complete: () => {}
      }
    )
  }

  createForm(){
    this.contactForm = this.fb.group({
      phone: ["", [Validators.required, Validators.pattern('^[1-9][0-9]{9}$')]]
    });

    this.contactForm1 = this.fb.group({
      phone: ["", [Validators.required, Validators.pattern('^[1-9][0-9]{9}$')]]
    });

    this.contactForm2 = this.fb.group({
      phone: ["", [Validators.required, Validators.pattern('^[1-9][0-9]{9}$')]]
    });
  } 

  handleSubmit(){
    let data = {
      phone_number: this.contactForm.value.phone,
      type: "customer"
    }
    this.loader = true;
    this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.Request_Call_Back, 
    data, {}, { contentType: { isFormDataContent: false } }).subscribe({
      next: result => {
        if(result.message) {
          this.loader = false;
          this.contactForm.reset();
          this.ToasterService.Success(result.message);
          let dialogRef = this.matDialog.open(OtpDialogComponent, {
            data: { device_id: '', device_type: 'web'},
            panelClass: ['signin-dialog', 'otp-dialog'],
          });
        }else{
          this.loader = false;
          let msg = 'Process failed';
          this.ToasterService.Error(msg);
        }
      },
      error: err => {
        this.loader = false;
        this.ToasterService.Error(err);
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  handleSubmit1(){
    let data = {
      phone_number: this.contactForm1.value.phone,
      type: "customer"
    }
    this.loader = true;
    this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.Request_Call_Back, 
    data, {}, { contentType: { isFormDataContent: false } }).subscribe({
      next: result => {
        if(result.message) {
          this.loader = false;
          this.contactForm1.reset();
          this.ToasterService.Success(result.message);
          let dialogRef = this.matDialog.open(OtpDialogComponent, {
            data: { device_id: '', device_type: 'web'},
            panelClass: ['signin-dialog', 'otp-dialog'],
          });
        }else{
          this.loader = false;
          let msg = 'Process failed';
          this.ToasterService.Error(msg);
        }
      },
      error: err => {
        this.loader = false;
        this.ToasterService.Error(err);
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  handleSubmit2(){
    let data = {
      phone_number: this.contactForm2.value.phone,
      type: "reseller"
    }
    this.loader = true;
    this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.Request_Call_Back, 
    data, {}, { contentType: { isFormDataContent: false } }).subscribe({
      next: result => {
        if(result.message) {
          this.loader = false;
          this.contactForm2.reset();
          this.ToasterService.Success(result.message);
          let dialogRef = this.matDialog.open(OtpDialogComponent, {
            data: { device_id: '', device_type: 'web'},
            panelClass: ['signin-dialog', 'otp-dialog'],
          });
        }else{
          this.loader = false;
          let msg = 'Process failed';
          this.ToasterService.Error(msg);
        }
      },
      error: err => {
        this.loader = false;
        this.ToasterService.Error(err);
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  /*------------------------- get categories -------------------------*/

  getCategoriesList(){
    this.user.homeCategoriesList().subscribe(categoryList=>{
      let response : any = categoryList;
      let data = {};
      data = response.data.rows;
      this.categoryList = data;
      // console.log(this.categoryList);
    })
  }

}


