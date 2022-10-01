import { Component, OnInit } from '@angular/core';
import { environment } from "environments/environment";
declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: 'home', title: 'Home', icon: 'dashboard', class: '' },
  { path: 'ques/questions', title: 'Questionary', icon: 'list', class: '' },
  { path: 'kyc/kycform', title: 'KYC', icon: 'list', class: '' },
  { path: 'categories', title: 'Category', icon: 'list', class: '' },
  { path: 'prefered-products', title: 'Prefered Products', icon: 'list', class: '' },
  { path: 'filtered-products', title: 'Filtered Products', icon: 'list', class: '' },
  { path: 'catalogue', title: 'Catalogues', icon: 'list', class: '' },
  { path: 'catalogue-product-list', title: 'Catalogues Product List', icon: 'list', class: '' },
  { path: 'categories-product-detail', title: 'Categories Product Detail', icon: 'list', class: '' },
  { path: 'order', title: 'Order', icon: 'list', class: '' },
  { path: 'create-catalogue', title: 'Create Catalogue', icon: 'list', class: '' },
  { path: 'catalogue-list', title: 'Catalogue List', icon: 'list', class: '' },
  { path: 'cart', title: 'Cart', icon: 'list', class: '' },
  { path: 'delivery-detail', title: 'Delivery Detail', icon: 'list', class: '' },
  { path: 'select-delivery-address', title: 'Select Delivery Address', icon: 'list', class: '' },
  { path: 'change-address', title: 'Change Address', icon: 'list', class: '' },
  { path: 'checkout', title: 'Checkout', icon: 'list', class: '' },
  { path: 'address-list', title: 'Address List', icon: 'list', class: '' },
  { path: 'payment', title: 'Payment', icon: 'list', class: '' },
  { path: 'about-us', title: 'About Us', icon: 'list', class: '' },
  { path: 'contact-us', title: 'Contact Us', icon: 'list', class: '' },
  { path: 'shipping-policy', title: 'Shipping Policy', icon: 'list', class: '' },
  { path: 'return-policy', title: 'Return policy', icon: 'list', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
 // adminUrl = environment.adminUrl;
  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
