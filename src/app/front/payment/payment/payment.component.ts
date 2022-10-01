import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalLibraryService } from 'app/front/util';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { UserService } from 'app/shared/services/user.service';
import { API } from 'app/shared/constants/endpoints';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';

import { environment } from 'environments/environment';

declare let Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {

  response;
  razorpayResponse;
  showModal = false;
  userData: any;
  shipingPrice: any;
  totalShippingTaxs: any;
  isProcessing: boolean = false;
  cartTotal: any;
  cartData: any;
  GST_amount: any;
  total_amt: any;
  razorpay_id: any;
  order_ids: any;
  instance_id: any;
  pay_type: any;
  pending_amount: any;
  user_id: any;
  totalShipping: any;
  totalShippingTax: any;

  constructor(private Router: Router, private razorpayService: ExternalLibraryService,
    private cd: ChangeDetectorRef, public localStorage: StorageAccessorService,
    private UserService: UserService, private toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService) { }

  ngOnInit(): void {
    this.userData = this.localStorage.fetchData()["data"];
    this.user_id = this.userData.id;
    if (localStorage.getItem("cartData")) {
      this.cartData = JSON.parse(localStorage.getItem('cartData'));
    }
    this.getCartTotal();
    this.calculateGSTAmount();
    this.getTotalAmount();
    this.razorpayService
      .lazyLoadLibrary("https://checkout.razorpay.com/v1/checkout.js")
      .subscribe();
  }

  getCartTotal() {
    this.cartTotal = 0;
    if (this.cartData) {
      this.cartData.forEach((data) => {
        if (data.user_id === this.userData.id) {
          this.cartTotal += data.sale_price * data.quantity;
        }
      })
    }
  }

  calculateGSTAmount() {
    this.GST_amount = 0;
    if (this.cartData) {
      this.cartData.forEach((data) => {
        if (data.user_id === this.userData.id) {
          //this.GST_amount += ((data.sale_price * data.gst)/100)*data.quantity;
          let amounts = Math.ceil(((data.sale_price * data.quantity) * data.gst) / 100).toFixed();
          this.GST_amount += Number(amounts);
        }
      })
    }
  }

  getTotalAmount() {
    if (localStorage.getItem("totalShipingPrice")) {
      this.totalShipping = localStorage.getItem("totalShipingPrice");
    }
    if (this.cartData) {
      if (this.totalShipping) {
        this.total_amt = this.cartTotal + this.GST_amount + Number(this.totalShipping);
      } else {
        this.total_amt = this.cartTotal + this.GST_amount;
      }
    }
  }

  proceed() {
    if (JSON.parse(localStorage.getItem("paymentMethodType"))) {
      let paymentMethodType = JSON.parse(localStorage.getItem("paymentMethodType"));
      if (paymentMethodType == 'online') {
        this.total_amt = JSON.parse(localStorage.getItem("pending_amount"));
        let order_data = JSON.parse(localStorage.getItem("pendingOrderAmount"));
        let payment_order_id = JSON.parse(localStorage.getItem("payment_order_id"));
        if (order_data.is_item_branding == 'yes') {
          this.createOrderInstanceOnRazorpay(order_data.id);
          /*let total = order_data.total_amount - order_data.payments[0].amount;
          if(total>0){
            this.createOrderInstanceOnRazorpay(order_data.id);
          }else{
            this.createOrderInstanceOnRazorpay(order_data.id);
            //this.verifyRazorpayPayments(payment_order_id);
          }*/
        } else {
          this.createOrderInstanceOnRazorpay(order_data.id);
          //this.verifyRazorpayPayments(payment_order_id);
        }
      } else if (paymentMethodType == 'manual') {
        this.toasterService.Error("Your payment method type is manual, You can't pay with razorpay!");
      }
    } else {
      if (localStorage.getItem("payment_type")) {
        this.pay_type = JSON.parse(localStorage.getItem("payment_type"));
        if (this.pay_type == 'partial_payment') {
          this.toasterService.Error("Razorpay payment have not allow partial payment");
        } else {
          this.createOrder();
        }
      }
    }
  }

  createOrder() {
    if (this.total_amt >= 500000) {
      this.toasterService.Error("You can not proceed with online payment per amount more than or equal to 5,00,000");
    } else {
      this.confirmationDialogHandlerService.openDialog({
        question: 'Do you want to confirm this order?',
        confirmText: 'Yes',
        cancelText: 'No'
      }).subscribe((result) => {
        if (result) {
          if (this.order_ids) {
            this.createOrderInstanceOnRazorpay(this.order_ids);
          } else {
            if (localStorage.getItem("shipingPrice")) {
              this.shipingPrice = localStorage.getItem("shipingPrice");
              this.totalShippingTax = localStorage.getItem("totalShippingTax");
            }
            let order = JSON.parse(localStorage.getItem("order"));
            let results = order.order_items.filter((x, k) => {
              if (x.user_id === this.userData.id) {
                return x;
              }
            });
            var element = {};
            element["user_address_id"] = order.user_address_id;
            element["delivery_type"] = order.delivery_type;
            element["delivery_charges"] = Number(this.shipingPrice);
            element["total_shipping_tax"] = Number(this.totalShippingTax);
            element["shipping_type"] = order.shipping_type;
            element["order_items"] = results;
            this.isProcessing = true;
            this.UserService.createOrder(element).subscribe({
              next: result => {
                if (result["success"] === true) {
                  this.order_ids = result['data'].id;
                  this.createOrderInstanceOnRazorpay(result['data'].id);
                  this.toasterService.Success(result["message"]);
                  this.isProcessing = false;
                  this.removeCartData();
                } else {
                  let msg = 'Create order process failed';
                  this.toasterService.Error(msg);
                  this.isProcessing = false;
                }
              },
              error: err => {
                this.toasterService.Error(err);
                this.isProcessing = false;
              },
              complete: () => {
              }
            });
          }
        }
      })
    }
  }

  /*-------------------------- createOrderInstanceOnRazorpay -------------------*/

  public createOrderInstanceOnRazorpay(order_id) {
    let data = {
      amount: ((Math.ceil(this.total_amt) * 100).toFixed()),
      //amount: this.total_amt * 100,
      currency: "INR",
      receipt: "order_rcptid_" + order_id + "(optional)",
      order_id: order_id,
      part_payment: "no"
    }
    if (this.instance_id) {
      this.verifyRazorpayPayments(this.instance_id);
    } else {
      this.UserService.createOrderInstanceOnRazorpay(data).subscribe({
        next: result => {
          if (result["success"] === true) {
            this.toasterService.Success(result["message"]);
            this.instance_id = result["data"].id;
            this.verifyRazorpayPayments(result["data"].id);
          } else {
            let msg = 'Order created process failed on Razorpay';
            this.toasterService.Error(msg);
          }
        },
        error: error => {
          this.toasterService.Error(error);
        },
        complete: () => {
        }
      });
    }
  }

  public verifyRazorpayPayments(razorpay_id) {
    this.razorpay_id = razorpay_id;

    let RAZORPAY_OPTIONS = {
      key: environment.razorpay.RAZORPAY_KEY_HERE,
      amount: (Math.ceil(this.total_amt) * 100).toFixed(),
      order_id: razorpay_id,
      handler: this.razorPaySuccessHandler.bind(this),
    };

    let razorpay = new Razorpay(RAZORPAY_OPTIONS);

    razorpay.open();
  }

  /*-------------------- verify Razorpay Payments -----------------------*/

  public razorPaySuccessHandler(response) {
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges();
    let data = {
      razorpay_id: this.razorpay_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      payment_instrument: "net_banking",
    }
    this.UserService.verifyRazorpayPayments(data).subscribe({
      next: result => {
        if (result["success"] === true) {
          this.toasterService.Success(result["message"]);
          this.Router.navigate(["process-completed"]);
        } else {
          let msg = 'Payment process failed on Razorpay';
          this.toasterService.Error(msg);
        }
      },
      error: err => {
        this.toasterService.Error(err);
      },
      complete: () => {

      }
    });
  }

  rtgs() {
    if (JSON.parse(localStorage.getItem("paymentMethodType"))) {
      let paymentMethodType = JSON.parse(localStorage.getItem("paymentMethodType"));
      if (paymentMethodType == 'online') {
        this.toasterService.Error("Your payment method type is online, You can't pay with manual!");
      } else if (paymentMethodType == 'manual') {
        this.Router.navigate(["payment/rtgs"]);
      }
    } else {
      this.Router.navigate(["payment/rtgs"]);
    }
  }

  neft() {
    if (JSON.parse(localStorage.getItem("paymentMethodType"))) {
      let paymentMethodType = JSON.parse(localStorage.getItem("paymentMethodType"));
      if (paymentMethodType == 'online') {
        this.toasterService.Error("Your payment method type is online, You can't pay with manual!");
      } else if (paymentMethodType == 'manual') {
        this.Router.navigate(["payment/neft"]);
      }
    } else {
      this.Router.navigate(["payment/neft"]);
    }
  }

  removeCartData() {

  }

}
