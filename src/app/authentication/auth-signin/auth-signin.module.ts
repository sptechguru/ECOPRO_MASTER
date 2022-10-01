import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { AuthSigninComponent } from './auth-signin.component';
import { SharedModule } from 'app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AuthSigninComponent } from './auth-signin.component';



const authRoutes: Routes = [
   { path: '', component: AuthSigninComponent },
  ];


@NgModule({
    declarations: [
    //    AuthSigninComponent,
      
  
    ],
    imports: [
      RouterModule.forChild(authRoutes),
      CommonModule,
      RouterModule,
      SharedModule,
      HttpClientModule,
      TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      }),
      HttpModule,
    ],
    exports:[SharedModule],

  })

  export class AuthSigninModule {
    constructor(){
    // console.log('login');
    }
  
   }

   export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }