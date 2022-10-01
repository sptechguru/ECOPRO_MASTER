import { KycComponent } from './front/kyc/kyc.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { componentFactoryName } from '@angular/compiler';
import { HomeComponent } from './front/home/home.component';
//import { QuestionsModule } from './questionary/questions/questions.module';
//import { AuthSigninModule } from './authentication/auth-signin/auth-signin.module';


const routes: Routes = [

  {
    path: '', 
    loadChildren:'./front/front-layout.module#FrontLayoutModule'
  },


  { path: 'auth/login', loadChildren: './authentication/auth-signin/auth-signin.module#AuthSigninModule'},
  { path: 'auth/signup', loadChildren: './authentication/auth-signup/auth-signup.module#AuthSignupModule'},
  //{ path: 'ques/questions', loadChildren: './questionary/questions/questions.module#QuestionsModule'}, 
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  // {
  //   path: '',
  //   redirectTo: 'admin/dashboard',
  //   pathMatch: 'full',
  // },
  //  {
  //   path: 'auth',
  //   children: [{
  //     path: '',
  //     loadChildren: './authentication/authentication.module#AuthenticationModule'
  //   }]
  // },
  // {
  //   path: 'admin',
  // //  canActivate: [AuthGuardService],
  //   component: AdminLayoutComponent,
  //   children: [{
  //     path: '',
  //     loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  //   }]
  // },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, 
      { scrollPositionRestoration: 'enabled', preloadingStrategy:PreloadAllModules, onSameUrlNavigation: 'reload'} 
    )
  ],
  exports: [RouterModule
  ],
})
export class AppRoutingModule { }
