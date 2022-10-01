import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { DataLoaderComponent } from './components/loader/data.loader.component';
import { CustomDatePipe } from './pipes/custom-data-filters.pipe';
import { CommonSortComponent } from './components/sort/common-sort.component';
import { CommonSearchComponent } from './components/search/common-search.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AppNgbPaginationComponent } from './components/app-ngb-pagination/app-ngb-pagination.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogHandlerService } from './components/confirmation-dialog/confirmation-dialog-handler.service';
import { ForgotPasswordComponent } from 'app/authentication/auth-signin/forgot-password/forgot-password.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import { ModalComponent } from './components/modal/modal.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTreeModule} from '@angular/material/tree';
import {MatTabsModule} from '@angular/material/tabs';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTreeModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    SlickCarouselModule,
    MatSidenavModule,
    MatTreeModule,
    MatListModule,
    MatTabsModule,
    NgxImageZoomModule,
    MatAutocompleteModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatTreeModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatTreeModule,
    MatTabsModule,
    NgxImageZoomModule,
    MatTableModule,
    // components
    CommonSearchComponent,
    CommonSortComponent,
    DataLoaderComponent,
    AppNgbPaginationComponent,
    ConfirmationDialogComponent,
    MatSidenavModule,
    MatListModule,
    //pipes
    CustomDatePipe,
    ModalComponent,
    MatAutocompleteModule,
    MatCardModule

  ],
  entryComponents:[ForgotPasswordComponent,],
  declarations: [
    // components
    CommonSearchComponent,
    CommonSortComponent,
    DataLoaderComponent,
    AppNgbPaginationComponent,
    ConfirmationDialogComponent,
    //pipes
    ForgotPasswordComponent,
    CustomDatePipe,
    ModalComponent,
  ],
  providers: [
    ConfirmationDialogHandlerService
  ]
})
export class SharedModule { }
