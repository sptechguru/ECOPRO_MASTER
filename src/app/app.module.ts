import { AuthGuardService } from './shared/services/auth.guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { ComponentsModule } from './components/components.module';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { SharedProvidersModule } from './shared/shared.providers.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertpopComponent } from './dialog/alertpop/alertpop.component';
import { RemoveAlertComponent } from './dialog/remove-alert/remove-alert.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import {ScrollingModule} from '@angular/cdk/scrolling'
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ShareButtonsModule,
    ShareIconsModule,
    ScrollingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    HttpModule,
    ComponentsModule,
    RouterModule,

    AppRoutingModule,
    SharedProvidersModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1,
      newestOnTop: true
    }),
    MatDialogModule
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AlertpopComponent,
    RemoveAlertComponent,
   
  ],
  providers: [AuthGuardService,{
    provide: MatDialogRef,

    useValue: {}
  }],
  entryComponents: [RemoveAlertComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
