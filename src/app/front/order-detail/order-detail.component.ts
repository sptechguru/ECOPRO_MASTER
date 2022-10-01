import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/shared/services/user.service';
import { API } from 'app/shared/constants/endpoints';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  toppings = new FormControl();
  orderDetail: any;
  orderItemDetail: any;
  paymentDetail: any;
  public orderId: any;
  total_amount: any;
  paid_amount: any;
  pending_amount: any;
  tracking_number: any;
  delivery_type: any;
  pay_type: any;
  default_image: any;
  TotalProductPrice: any;
  TotalTaxRate: any;
  TotalTax: any;
  TotalGST: any;
  TotalBrandingAmount: any;
  deliveryCharges: any;
  totalShippingTax: any;
  paymentMethodType: any;
  payment_order_id: any;
  toppingList: string[] = ['Download Bills', 'Download Chalaan', 'Download Invoice'];

  constructor(private Router: Router, private _route: ActivatedRoute, 
    private UserService: UserService, private ToasterService: ToasterService) { }

  ngOnInit(): void {
    this.orderId = this._route.snapshot.paramMap.get('id');
    this.getOrderDetail(this.orderId);
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
  }

  getOrderDetail(orderID){
    this.UserService.orderDetail(orderID).subscribe(orderDetail=>{
      this.orderDetail = orderDetail["data"];
      this.orderItemDetail = this.orderDetail.order_items;
      this.tracking_number = this.orderDetail.tracking_number;
      this.deliveryCharges = this.orderDetail.delivery_charges + this.orderDetail.total_shipping_tax;
      this.calculateProductPrice();
      this.calculateTotalGST();
      this.calculateBrandingAmount();
      this.total_amount = this.TotalProductPrice+this.TotalGST+this.deliveryCharges;

      /*------------------ online payment -----------------*/
      this.paymentMethodType = '';
      this.paid_amount = 0;
      if(this.orderDetail.payments.length>0){
        this.paymentMethodType = this.orderDetail.payments[0].payment_type;
        this.payment_order_id = this.orderDetail.payments[0].payment_order_id;
        if(this.paymentMethodType == 'manual'){
          this.orderDetail.payments.forEach((data) => {
            this.paid_amount += data.amount;
          })
        }else if(this.paymentMethodType == 'online'){
          if(this.orderDetail.is_item_branding == 'yes'){
            this.orderDetail.payments.forEach((data) => {
              if(data.payment_status == 'paid'){
                this.paid_amount += data.amount;
              }
            })
          }else if(this.orderDetail.is_item_branding == 'no'){
            this.orderDetail.payments.forEach((data) => {
              if(data.payment_status == 'paid'){
                this.paid_amount += data.amount;
              }
            })
            /*if(this.orderDetail.payments[0].payment_status == 'pending'){
              this.paid_amount = 0;
            }else if(this.orderDetail.payments[0].payment_status == 'paid'){
              this.orderDetail.payments.forEach((data) => {
                this.paid_amount += data.amount;
              })
            }*/
          }
        }
      }  
        
        this.pending_amount = (this.total_amount - this.paid_amount).toFixed(2);
        this.delivery_type = this.orderDetail.delivery_type;
        if(this.orderDetail.payments.length>0 && this.orderDetail.payments[0].part_payment == 'yes'){
          this.pay_type = 'partial_payment';
        }
        if(this.orderDetail.payments.length>0 && this.orderDetail.payments[0].part_payment == 'no'){
          this.pay_type = 'full_payment';
        }
    });  
  }

  calculateProductPrice(){
    this.TotalProductPrice = 0;
    this.orderItemDetail.forEach((data) => {
      this.TotalProductPrice += (data.sale_price*data.quantity + data.branding_amount);
    })
    this.TotalProductPrice = this.TotalProductPrice;
  }
  
  calculateBrandingAmount(){
    this.TotalBrandingAmount = 0;
    this.orderItemDetail.forEach((data) => {
      this.TotalBrandingAmount += data.branding_amount;
    })
    this.TotalBrandingAmount = this.TotalBrandingAmount;
  }

  calculateTotalGST(){
    this.TotalGST = 0;
    this.orderItemDetail.forEach((data) => {
      let amounts = Math.ceil(((data.sale_price * data.quantity)*data.gst_rate)/100).toFixed();
      this.TotalGST += Number(amounts);
      //this.TotalGST += ((data.sale_price * data.gst_rate)/100)*data.quantity;
    })
    this.TotalGST = this.TotalGST; 
  }

  payment(){
    if(this.paymentMethodType == 'manual'){
      if(this.pending_amount > 0){
        localStorage.setItem("paid_amount", JSON.stringify(this.paid_amount.toFixed(2)));
        localStorage.setItem("pending_amount", JSON.stringify(this.pending_amount));
        localStorage.setItem("pendingOrderAmount", JSON.stringify(this.orderDetail));
        localStorage.setItem("paymentMethodType", JSON.stringify(this.paymentMethodType));
        if(this.pay_type){
          this.pay_type = this.pay_type;
          localStorage.setItem("payment_type", JSON.stringify(this.pay_type));
          this.Router.navigate(["/payment"]);
        }else{
          this.pay_type = 'full_payment';
          this.ToasterService.Error("Something went wrong with this order, Your can not proceed with paid amount 0");
        }
      }
    }else if(this.paymentMethodType == 'online'){
      if(this.pending_amount > 0){
        localStorage.setItem("pending_amount", JSON.stringify(this.pending_amount));
        localStorage.setItem("pendingOrderAmount", JSON.stringify(this.orderDetail));
        localStorage.setItem("paymentMethodType", JSON.stringify(this.paymentMethodType));
        localStorage.setItem("payment_order_id", JSON.stringify(this.payment_order_id));
        if(this.pay_type){
          this.pay_type = 'full_payment';
          localStorage.setItem("payment_type", JSON.stringify(this.pay_type));
          this.Router.navigate(["/payment"]);
        }
      }
    }else{
      if(this.pending_amount > 0 && this.orderDetail.payments.length == 0){
        localStorage.setItem("pending_amount", JSON.stringify(this.pending_amount));
        localStorage.setItem("pendingOrderAmount", JSON.stringify(this.orderDetail));
        localStorage.setItem("paymentArray", 'true');
        this.pay_type = 'full_payment';
        localStorage.setItem("payment_type", JSON.stringify(this.pay_type));
        this.Router.navigate(["/payment"]);
      }
    }
  }

  toFixedFun(val){
    if(val){
      return Math.ceil(val).toFixed();
    }else{
      return 0;
    }
  }

}
