import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
//import { AuthSignupComponent } from './auth-signup/auth-signup.component';
//import { AuthSigninComponent } from './auth-signin/auth-signin.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';
//import { AuthChangePasswordComponent } from './auth-change-password/auth-change-password.component';
import { SharedModule } from 'app/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UpdateEmailComponent } from './update-email/update-email.component';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule
  ],
  declarations: [
    //AuthSigninComponent,
    //AuthSignupComponent,
    AuthResetPasswordComponent,
   // AuthChangePasswordComponent,
    ForgotPasswordComponent,
    UpdateEmailComponent
  ]
})
export class AuthenticationModule { }
