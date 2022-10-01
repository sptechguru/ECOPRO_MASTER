import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { ForgotPasswordComponent } from './forgot-password.component';
import { SharedModule } from 'app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

const authRoutes: Routes = [
  { path: '',
    // component: ForgotPasswordComponent 
  },
];


@NgModule({
    declarations: [
        //ForgotPasswordComponent,
  
    ],
    
    entryComponents:[
      //ForgotPasswordComponent,
    
    ],
    imports: [
      RouterModule.forChild(authRoutes),
      CommonModule,
      RouterModule,
      SharedModule,
      HttpClientModule,
      HttpModule,
      TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      }),
    ]
  })

  export class ForgotPasswordModule {
    constructor(){

    }
  
   }

   
   export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }