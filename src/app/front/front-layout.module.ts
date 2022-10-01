import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { HomeComponent } from './home/home.component';
import { FrontHeaderComponent } from './front-header/front-header.component';
import { FrontFooterComponent } from './front-footer/front-footer.component';
import { SharedModule } from 'app/shared/shared.module';
import { DialogComponent } from './front-header/dialog/dialog.component';
import { AuthSigninComponent } from 'app/authentication/auth-signin/auth-signin.component';
import { AuthSignupComponent } from 'app/authentication/auth-signup/auth-signup.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { KycComponent } from './kyc/kyc.component';
import { QuestionsComponent } from './questions/questions.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesProductListComponent } from './categories-product-list/categories-product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FrontSidebarComponent } from './front-sidebar/front-sidebar.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { BuisnessProfileComponent } from './buisness-profile/buisness-profile.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { LanguagePreferanceComponent } from './language-preferance/language-preferance.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CatalogueProductListComponent } from './catalogue-product-list/catalogue-product-list.component';
import { NotificationComponent } from './notification/notification.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ReturnComponent } from './return/return.component';
import { ProcessCompletedComponent } from './process-completed/process-completed.component';
import { AddCatalogueComponent } from './add-catalogue/add-catalogue.component';
import { CreateCatalogueComponent } from './create-catalogue/create-catalogue.component';
import { ProductBrandingComponent } from './product-branding/product-branding.component';
import { BrandingTypeComponent } from './branding-type/branding-type.component';
import { BrandingStepComponent } from './branding-step/branding-step.component';
import { BrandingSelectionComponent } from './branding-selection/branding-selection.component';
import { CartComponent } from './cart/cart.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { SelectDeliveryAddressComponent } from './select-delivery-address/select-delivery-address.component';
import { ChangeAddressComponent } from './change-address/change-address.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddressListComponent } from './address-list/address-list.component';
import { PaymentComponent } from './payment/payment/payment.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail/payment-detail.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { Ng5SliderModule } from 'ng5-slider';
import { FilterSidebarComponent } from './filter-sidebar/filter-sidebar.component';
import { Pipe, PipeTransform } from '@angular/core';
import { LiveStockComponent } from './product-details/live-stock/live-stock.component';
import { TrackingStatusComponent } from './tracking-status/tracking-status.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CatalogueUpdateComponent } from './catalogue-update/catalogue-update.component';
import { CatalogueMultipleProductsComponent } from './catalogue-multiple-products/catalogue-multiple-products.component';
import { CatalogueAddProductsComponent } from './catalogue-add-products/catalogue-add-products.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { ShippingPolicyComponent } from './shipping-policy/shipping-policy.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { SafePipe } from './product-details/pipe';
import { ReserveStockComponent } from './product-details/reserve-stock/reserve-stock.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { SearchDealsProductComponent } from './search-deals-product/search-deals-product.component';
import { CategoryPipe } from './search-deals-product/deals-sorting.pipe';
import { ApplyComponent } from './apply/apply.component';
import { ProductVariantDetailComponent } from './product-variant-detail/product-variant-detail.component';
import { MyOrderByPipe } from './categories-product-list/sort.pipe';
import { SearchFilteredProductComponent } from './search-filtered-product/search-filtered-product.component';
import { SortByPipe } from 'app/shared/pipes/product-list-sort.pipe';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { OtpDialogComponent } from './home/otp-dialog/otp-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoadBlockBannerComponent } from './road-block-banner/road-block-banner.component';
import { HelpSupportFormComponent } from './help-support-form/help-support-form.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { NewProductDetailsPageComponent } from './new-product-details-page/new-product-details-page.component';
import { PreviewComponent } from './preview/preview.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { KycdilogformComponent } from './kycdilogform/kycdilogform.component';
import { CustomerdetailComponent } from './customerdetail/customerdetail.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
@Pipe({
  name: 'search_country',
  pure: true
})
export class SearchCountryPipe implements PipeTransform {
    transform(items: any[], args: string): any[] {
		if(args !== undefined){       
      args = args.toUpperCase();
      let search_results = items.filter(item => item.variant_name.toUpperCase().indexOf(args) !== -1);
      if(search_results){
        return search_results;
      }
		}
    }
}

const routes :Routes = [
  { path : '' , component : FrontLayoutComponent , children: [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  // { path: 'home',component:NewProductDetailsPageComponent},
  {
    path:'preview/:id',component:PreviewComponent
  },
  { path: 'home', component: HomeComponent },
  { path: 'ques/questions', component: QuestionsComponent },

  { path: 'kyc/kycform', component: KycComponent },

  { path: 'kyc/dilogform', component: KycdilogformComponent },


  { path: 'categories', component: CategoriesComponent },
  { path: 'prefered-products', component: CategoriesProductListComponent },
  { path: 'filtered-products/:id/:pid', component: CategoriesProductListComponent },
  { path: 'filtered-products/:id', component: CategoriesProductListComponent },
  { path: 'filtered-products', component: SearchProductComponent },
  { path: 'search-filtered-products', component: SearchFilteredProductComponent },
  { path: 'search-deals-product/:deals_id', component: SearchDealsProductComponent },
  { path: 'categories/:id', component: CategoriesProductListComponent },
  { path: 'categories/:id/:pid/:vid', component: ProductDetailsComponent },
 // { path: 'categories/:pid/:vid', component: ProductDetailsComponent },
  { path: 'deals/:deals_id/:pid/:vid', component: ProductVariantDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile-details', component: ProfileDetailsComponent },
  { path: 'buisness-profile', component: BuisnessProfileComponent },
  { path: 'manage-team', component: ManageTeamComponent },
  { path: 'language-preferance', component: LanguagePreferanceComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'catalogue-product-list', component: CatalogueProductListComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order-detail/:id', component: OrderDetailComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'return', component: ReturnComponent },
  { path: 'process-completed', component: ProcessCompletedComponent },
  {
    path:'add-catalogue',component:AddCatalogueComponent
  },
  { path: 'add-catalogue/:vid', component: AddCatalogueComponent },
  { path: 'create-catalogue', component: CreateCatalogueComponent },
  {
    path: 'create-catalogue/:id', component: CreateCatalogueComponent
  },
  { path: 'product-branding', component: ProductBrandingComponent },
  { path: 'branding-type', component: BrandingTypeComponent },
  { path: 'branding-step', component: BrandingStepComponent },
  { path: 'branding-selection/:id/:pid/:vid', component: BrandingSelectionComponent },
  { path: 'cart', component: CartComponent },
  { path: 'delivery-detail', component: DeliveryDetailComponent },
  { path: 'select-delivery-address', component: SelectDeliveryAddressComponent },
  { path: 'change-address', component: ChangeAddressComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'address-list', component: AddressListComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment/:type', component: PaymentDetailComponent },
  { path: 'edit-address/:id', component: EditAddressComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'tracking-status/:id', component: TrackingStatusComponent },
  { path: 'catalogue/:id' , component: CatalogueUpdateComponent },
  { path: 'catalogue-product-list/:cid/:id', component: CatalogueProductListComponent },
  { path: 'catalogue-product-list/:id', component: CatalogueProductListComponent },
  { path: 'catalogue-multiple-products', component: CatalogueMultipleProductsComponent },
  { path: 'add-catalogue-products/:cid/:id', component: CatalogueAddProductsComponent },
  { path: 'add-catalogue-products/:id', component: CatalogueAddProductsComponent },
  { path: 'shipping-policy', component: ShippingPolicyComponent },
  { path: 'help_support', component: HelpSupportFormComponent },
  { path: 'feedback_support', component: HelpSupportFormComponent },
  { path: 'return-policy', component: ReturnPolicyComponent },
  { path: 'search', component: ApplyComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-detail/:id', component: BlogDetailComponent },
  { path: 'road-banner', component: RoadBlockBannerComponent },
  {path:'collection-list',component:CollectionListComponent}
]},
]

@NgModule({
  declarations: [HomeComponent, FrontLayoutComponent, FrontHeaderComponent, FrontFooterComponent,
    QuestionsComponent, DialogComponent, KycComponent, AuthSigninComponent, AuthSignupComponent, 
    CategoriesComponent, CategoriesProductListComponent, ProductDetailsComponent, FrontSidebarComponent, 
    ProfileComponent, ProfileDetailsComponent, BuisnessProfileComponent, ManageTeamComponent, 
    LanguagePreferanceComponent, CatalogueComponent, CatalogueProductListComponent, 
     NotificationComponent, OrderComponent, OrderDetailComponent, 
    FeedbackComponent, ReturnComponent, ProcessCompletedComponent, AddCatalogueComponent, 
    CreateCatalogueComponent, ProductBrandingComponent, BrandingTypeComponent, 
    BrandingStepComponent, CartComponent, DeliveryDetailComponent, SelectDeliveryAddressComponent, 
    ChangeAddressComponent, CheckoutComponent,AddressListComponent, PaymentComponent, PaymentDetailComponent, 
    EditAddressComponent, CatalogueUpdateComponent, ComingSoonComponent, SearchCountryPipe, AboutUsComponent,
    CatalogueProductListComponent, ContactUsComponent, FilterSidebarComponent, LiveStockComponent, 
    TrackingStatusComponent, CatalogueMultipleProductsComponent, CatalogueAddProductsComponent, 
    ReturnPolicyComponent, ShippingPolicyComponent, SafePipe, ReserveStockComponent, SearchProductComponent, 
    SearchDealsProductComponent, CategoryPipe, ApplyComponent, ProductVariantDetailComponent,
    MyOrderByPipe, SortByPipe,
    SearchFilteredProductComponent,
    BlogComponent,
    BlogDetailComponent,
    OtpDialogComponent,
    RoadBlockBannerComponent,
    HelpSupportFormComponent,
    CollectionListComponent,NewProductDetailsPageComponent,PreviewComponent, KycdilogformComponent, CustomerdetailComponent, TestimonialComponent],
    
  entryComponents:[
    DialogComponent,
    RoadBlockBannerComponent
  ],

  providers: [
    MyOrderByPipe, SortByPipe,
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],

  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    HttpClientModule,
    ShareButtonsModule,
    ShareIconsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    HttpModule,
    InfiniteScrollModule,
    Ng5SliderModule,
    MatExpansionModule,
    MatStepperModule,
    NgxMatSelectSearchModule,
    ScrollingModule,
    NgxExtendedPdfViewerModule,
    NgxImageZoomModule,
    MatTooltipModule,
    NgxSpinnerModule
  ]
})
export class FrontLayoutModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}