import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthSignupComponent } from './auth-signup.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const authRoutes: Routes = [
    { path: '', component: AuthSignupComponent },
  ];


@NgModule({
    declarations: [
        AuthSignupComponent,
    ],
    imports: [
      RouterModule.forChild(authRoutes),
      CommonModule,
      RouterModule,
      SharedModule,
      HttpClientModule,
      ReactiveFormsModule,
      TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      }),
      HttpModule,
    
    ],
    exports: [SharedModule]
  })

  export class AuthSignupModule {
    constructor(){
    // console.log('login');
    }
  
   }

   export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }