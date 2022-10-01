import { ApiHandlerService } from './shared/services/api-handler.service';
import { Component} from '@angular/core';
import { API } from "app/shared/constants/endpoints";
import { Router, NavigationEnd } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router ,private _api:ApiHandlerService) {}


  ngOnInit() {
    this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
    
    gtag('config', 'G-K0KXNK2CYC', {
    'page_path': event.urlAfterRedirects
    });
    
    });
    this.checkToken();
  }

  async checkToken(){
    let token = await localStorage.getItem('userData');
    if(token){
      this.getKycDetails2();
    }
  }


  getKycDetails2(){
    this._api.apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS).subscribe((res)=>{
      console.log("respone all data",res);

      console.log(res.data);
      
    },error =>{
      console.log(error);
      
    })
 
  }
  
  // getKycDetails(){
  //   this._api.apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS).pipe(
  //     tap({
  //       next:res=>{
  //         debugger;
  //         console.log(res,"resresres");
  //           // console.log(res.data, "gyc method called............" );
  //           localStorage.setItem('kyc',JSON.stringify(res.data));
  //       },
  //       error:err=> {
  //         console.log("erro,,,,,,,,,,",err);
  //       }  
  //     })
  //   ).subscribe()
  // }


  
}
