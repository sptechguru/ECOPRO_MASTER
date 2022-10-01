import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { API } from 'app/shared/constants/endpoints';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartData;
  cartTotal;
  gstPer;
  payment_type: any;
  GST_amount: any;
  total_amount: any;
  default_image: any;
  userData: any;
  shipingPrice: any;

  constructor(private Router: Router,  private toasterService: ToasterService,
    private UserService: UserService, public localStorage : StorageAccessorService) { }

  ngOnInit(): void {
    this.cartData = JSON.parse(localStorage.getItem('cartData'));
    let order = JSON.parse(localStorage.getItem("order"));
    this.userData = this.localStorage.fetchData()["data"];
    this.getCartTotal();
    this.calculateGSTAmount();
    //this.getDeliveryPrice();
    this.getTotalAmount();
    if(this.total_amount<=500000){
      this.payment_type = 'full_payment';
    }else if(this.total_amount>500000){
      this.payment_type = '';
    }
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;  
  }

  paymentType(value){
    this.payment_type = value;
  }
  
  checkout(){
    if(this.payment_type != ''){
      localStorage.setItem("payment_type", JSON.stringify(this.payment_type));
      let order = JSON.parse(localStorage.getItem("order"));
      this.Router.navigate(["/payment"]);
    }else{
      this.toasterService.Error('Please select payment type');
    }
  }

  getCartTotal(){
    this.cartTotal = 0;
    this.cartData.forEach((data) => {
      if(data.user_id === this.userData.id){
        this.cartTotal += data.sale_price * data.quantity;
      }  
    })
  }

  calculateGSTAmount(){
    this.GST_amount = 0;
    this.cartData.forEach((data) => {
      if(data.user_id === this.userData.id){
        let amounts = Math.ceil(((data.sale_price * data.quantity)*data.gst)/100).toFixed();
        this.GST_amount += Number(amounts);
      }  
    })
  }

  getTotalAmount(){
    if(localStorage.getItem("totalShipingPrice")){
      this.shipingPrice = localStorage.getItem("totalShipingPrice");
    }
    if(this.shipingPrice){
      this.total_amount = this.cartTotal + this.GST_amount + Number(this.shipingPrice);
    }else{
      this.total_amount = this.cartTotal + this.GST_amount;
    }
  }

  viewDetail(){
    this.Router.navigate(['/delivery-detail']);
  }

  toFixedFun(val){
    if(val){
      return Math.ceil(val).toFixed();
    }else{
      return 0;
    }
  }

  productDetailDealsRoute(deals_id, product_id, variant_id){
    this.Router.navigate(['categories', deals_id, product_id, variant_id], 
    { queryParams: { deals: true } })
  }

}
