import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EmailVerfiedComponent } from './email-verfied/email-verfied.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedModule } from '../shared/shared.module';
import { DialogBoxService } from 'app/shared/services/dialog-box.service';

const auth : Routes = [
  { path: 'email-verify/:code', component: EmailVerfiedComponent},
  { path: 'reset-password/:code', component: ResetPasswordComponent},
];

@NgModule({
  declarations: [EmailVerfiedComponent,ResetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(auth),
    SharedModule,
  ],
  providers: [DialogBoxService]
})

export class AuthModule { }
