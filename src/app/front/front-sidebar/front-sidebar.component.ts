import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { API } from "app/shared/constants/endpoints";
import { ApiHandlerService } from "app/shared/services/api-handler.service";
import { StorageAccessorService } from "app/shared/services/localstorage-accessor.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ifError } from "assert";
import { environment } from "environments/environment";
import { Subscription } from "rxjs";
import { DialogService } from "../front-header/dialog/dialog.service";
declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "home", title: "Home", icon: "dashboard", class: "" },
  { path: "ques/questions", title: "Questionary", icon: "list", class: "" },
  { path: "kyc/kycform", title: "KYC", icon: "list", class: "" },
  { path: "categories", title: "Category-Products", icon: "list", class: "" },
  {
    path: "prefered-products",
    title: "Prefered Products",
    icon: "list",
    class: "",
  },
  {
    path: "filtered-products",
    title: "Filtered Products",
    icon: "list",
    class: "",
  },
  { path: "catalogue", title: "Catalogues", icon: "list", class: "" },
  {
    path: "catalogue-product-list",
    title: "Catalogues Product List",
    icon: "list",
    class: "",
  },
  {
    path: "categories-product-detail",
    title: "Categories Product Detail",
    icon: "list",
    class: "",
  },
  { path: "order", title: "My Order", icon: "list", class: "" },
  {
    path: "create-catalogue",
    title: "Create Catalogue",
    icon: "list",
    class: "",
  },
  { path: "catalogue-list", title: "Catalogue List", icon: "list", class: "" },
  { path: "cart", title: "Cart", icon: "list", class: "" },
  {
    path: "delivery-detail",
    title: "Delivery Detail",
    icon: "list",
    class: "",
  },
  {
    path: "select-delivery-address",
    title: "Select Delivery Address",
    icon: "list",
    class: "",
  },
  { path: "change-address", title: "Change Address", icon: "list", class: "" },
  { path: "checkout", title: "Checkout", icon: "list", class: "" },
  { path: "address-list", title: "Address List", icon: "list", class: "" },
  { path: "payment", title: "Payment", icon: "list", class: "" },
  { path: "about-us", title: "About Us", icon: "list", class: "" },
  { path: "contact-us", title: "Contact Us", icon: "list", class: "" },
  {
    path: "shipping-policy",
    title: "Shipping Policy",
    icon: "list",
    class: "",
  },
  { path: "return-policy", title: "Return policy", icon: "list", class: "" },
];

@Component({
  selector: "app-front-sidebar",
  templateUrl: "./front-sidebar.component.html",
  styleUrls: ["./front-sidebar.component.css"],
})
export class FrontSidebarComponent implements OnInit {
  public list = document.getElementById("main-body");
  @Input() sideNavbar;
  requestKycSubscription: Subscription;
  public messageForSibling: any;
  privacyUrl: any;
  appVersion: any;
  userData: any;
  profile: any;
  menuItems: any[];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _api: ApiHandlerService,
    public localStorage: StorageAccessorService,
    private commModel: DialogService,
    private ToasterService: ToasterService
  ) {
    this.list.classList.add("sidebar-open");
    //console.log(this.parentValue);
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.privacyUrl =
      environment.AssetsUrl + "/pdf/ek-matra-privacy-policy.pdf";
    if (this.localStorage.fetchData()) {
      this.userData = this.localStorage.fetchData()["data"];
      this.profile = this.userData.profile_pic_150x150;
    }
    this.getAppVersion();
  }

  get userName() {
    let data = this.localStorage.fetchData();

    if (data) {
      if (data["data"].full_name) return data["data"].full_name;
    } else return "";
  }

  get userEmail() {
    let data = this.localStorage.fetchData();
    if (data) {
      if (data["data"].email) return data["data"].email;
    } else return "";
  }

  get BusinessKyc() {
    let b_kyc = JSON.parse(localStorage.getItem("kyc"));

    if (b_kyc) {
      return b_kyc.business_kyc;
    } else return "";
  }

  get PersonalKyc() {
    let p_kyc = JSON.parse(localStorage.getItem("kyc"));
    if (p_kyc) {
      return p_kyc.personel_kyc;
    } else return "";
  }

  get billing() {
    let billing = JSON.parse(localStorage.getItem("billing"));
    console.log(billing);
    if (billing) {
      return true;
    } else return false;
  }

  ngOnDestroy(): void {
    this.list.classList.remove("sidebar-open");
  }

  logout() {
    let userData = this.localStorage.fetchData();
    // console.log(userData.access_token);
    // if (userData['data'].user_role.role_name === 'reseller') {
    //   localStorage.removeItem("userData");
    // }
    this._api
      .apiGet(API.AUTH_ENDPOINTS.LOGOUT, userData.access_token)
      .subscribe({
        next: (result) => {
          console.log(result);
          localStorage.removeItem("kyc");
          localStorage.removeItem("billing");
          localStorage.removeItem("get-all-search-data");
          localStorage.clear();
          if (result.message) {
            this.ToasterService.Error(result.message);
            this._router.navigate(["/"]);
          }
        },
        error: (err) => {
          // console.log(err);
          this.ToasterService.Error(err);
        },
      });
  }

  getAppVersion() {
    this._api.apiGet(API.AUTH_ENDPOINTS.API + "?app_type=reseller").subscribe({
      next: (result) => {
        if (result.success == true) {
          this.appVersion = result.data.reseller;
        }
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }
}
