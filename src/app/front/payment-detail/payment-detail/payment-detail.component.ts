import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , FormControl, Validators, AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { API } from 'app/shared/constants/endpoints';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];

  public type: any;
  paymentForm: FormGroup;
  receipt: any;
  public imagePath;
  imgURL: any;
  cartData;
  cartTotal;
  public pay_type: any;
  amount_status: boolean = true;
  pendingOrder: any;
  total_amount: any;
  paid_amount: any;
  pending_amount: any;
  gstTotal;
  GST_amount: any;
  total_amt: any;
  isLoginProcessing = false;
  userData: any;
  shipingPrice: any;
  payFailedStatus: boolean = false;
  orderId: any;
  reciept_ext: any;
  totalShipping: any;
  totalShippingTax: any;

  constructor(private Router: Router, private _route : ActivatedRoute, 
    private toasterService: ToasterService, private fb: FormBuilder,
    private UserService: UserService, public localStorage : StorageAccessorService) { }

  ngOnInit(): void {
    this.createForm();
    this.userData = this.localStorage.fetchData()["data"];
    this.type = this._route.snapshot.paramMap.get('type');
    if(localStorage.getItem("cartData")){
      this.cartData = JSON.parse(localStorage.getItem('cartData'));
    }else{
      //this.toasterService.Error('Something went wrong! You can not make payment');
    } 
    if(localStorage.getItem("payment_type")){
      this.pay_type = JSON.parse(localStorage.getItem("payment_type"));
    }else{
      this.toasterService.Error('Something went wrong! You can not make payment');
    }
    this.getCartTotal();
    this.calculateGSTAmount();
    this.getTotalAmount();
    
    if(JSON.parse(localStorage.getItem("pendingOrderAmount")) && 
    localStorage.getItem("paymentArray")){
      this.pendingOrder = JSON.parse(localStorage.getItem("pendingOrderAmount"));
      this.paymentForm.controls['amount'].disable();
      this.paymentForm.value.amount = this.pendingOrder;
      this.paymentForm.setValue({transaction_number: '', amount: this.pendingOrder});
    }else if(JSON.parse(localStorage.getItem("pendingOrderAmount")) 
      && !localStorage.getItem("paymentArray")){
      this.pendingOrder = JSON.parse(localStorage.getItem("pendingOrderAmount"));
      this.total_amount = this.pendingOrder.total_amount;
      this.paid_amount = JSON.parse(localStorage.getItem("paid_amount"));
      this.pending_amount = JSON.parse(localStorage.getItem("pending_amount"));
      if(this.pay_type === 'full_payment'){
        this.paymentForm.controls['amount'].disable();
        if(this.total_amt){
          this.paymentForm.setValue({transaction_number: '', amount: Math.ceil(this.total_amt).toFixed()});
        }else{
          this.paymentForm.setValue({transaction_number: '', amount: this.pending_amount});
        }
      }else if(this.pay_type === 'partial_payment'){
      

      } 
    }else if(!JSON.parse(localStorage.getItem("pendingOrderAmount")) && 
      !localStorage.getItem("paymentArray")){
      if(this.pay_type === 'full_payment'){
        if(this.total_amt){
          this.paymentForm.controls['amount'].disable();
          this.paymentForm.value.amount = this.total_amt;
          this.paymentForm.setValue({transaction_number: '', amount: Math.ceil(this.total_amt).toFixed()});
        }
      }else if(this.pay_type === 'partial_payment'){

      } 
    }  
  }

  createForm(){
    this.paymentForm = this.fb.group({
      transaction_number : ["", [Validators.required, Validators.pattern('^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.]+$')]],
      amount: ["", [Validators.required, Validators.pattern('^[0-9]{1,6}$')]],
      //amount: ["", [Validators.required]],
    });
  }

  getCartTotal(){
    this.cartTotal = 0;
    if(this.cartData){
      this.cartData.forEach((data) => {
        if(data.user_id === this.userData.id){
          this.cartTotal += data.sale_price * data.quantity;
        }
      })
    }
  }

  calculateGSTAmount(){
    this.GST_amount = 0;
    if(this.cartData){
      this.cartData.forEach((data) => {
        if(data.user_id === this.userData.id){
          let amounts = Math.ceil(((data.sale_price * data.quantity)*data.gst)/100).toFixed();
          this.GST_amount += Number(amounts);
        } 
      })
    }  
  }

  getTotalAmount(){
    if(localStorage.getItem("totalShipingPrice")){
      this.totalShipping = localStorage.getItem("totalShipingPrice");
      this.shipingPrice = localStorage.getItem("shipingPrice");
      this.totalShippingTax = localStorage.getItem("totalShippingTax");
    }
    if(this.cartData){
      if(this.totalShipping){
        this.total_amt = this.cartTotal + this.GST_amount + Number(this.totalShipping);
      }else{
        this.total_amt = this.cartTotal + this.GST_amount;
      }
    }
  }

  onFileChange(event, files) {
    if (files.length === 0)
      return;
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
   this.receipt = event[0];
   if(this.receipt.type == 'application/pdf'){
     this.reciept_ext = 'pdf';
     //this.imgURL = environment.AssetsUrl+'/pdf/pdf.pdf'; 
   }else{
    this.reciept_ext = 'jpg';
   }
   this.paymentForm.value.transaction_receipt = this.receipt;
  }

  paymentSubmit(){
    if(!this.paymentForm.value.transaction_number){
      this.toasterService.Error("Number is required");
    }else if(Number(this.paymentForm.value.amount) > Number(this.pending_amount)){
      this.toasterService.Error("Enter amount is more than of your pending amount"); 
    }else if(!this.receipt){
      this.toasterService.Error("Please upload receipt");
    }else if(this.pendingOrder){
      if(this.pay_type === 'full_payment'){
        this.paymentForm.value.transaction_receipt = this.receipt;
        this.paymentForm.value.part_payment = 'no';
        this.paymentForm.value.payment_instrument  = this.type;
        if(this.total_amt){
          this.paymentForm.value.amount = this.total_amt;
        }else if(this.pending_amount){
          this.paymentForm.value.amount = this.pending_amount;
        }
        this.orderPayment(this.pendingOrder.id, this.paymentForm.value);
      }else if(this.pay_type === 'partial_payment'){
        let partial_amount = Math.ceil((this.pending_amount/100)*10).toFixed();
        if(Number(this.paymentForm.value.amount) < Number(partial_amount)){
          this.toasterService.Error("Enter amount at least 10%("+partial_amount+") of total amount");
        }else{
          this.paymentForm.value.transaction_receipt = this.receipt;
          this.paymentForm.value.part_payment = 'no';
          this.paymentForm.value.payment_instrument  = this.type;
          this.orderPayment(this.pendingOrder.id, this.paymentForm.value);
        }
      }
    }else if(!this.pendingOrder){
      if(this.pay_type === 'partial_payment'){
        let partial_amount = Math.ceil((this.total_amt/100)*10).toFixed();
        if(Number(this.paymentForm.value.amount) < Number(partial_amount)){
          this.toasterService.Error("Enter amount at least 10%("+partial_amount+") of total amount");
        }else if(Number(this.paymentForm.value.amount) >= this.total_amt){
          this.toasterService.Error("Please enter amount less than of total amount");
        }else{
          this.paymentForm.value.transaction_receipt = this.receipt;
          this.createOrderAPI();
        }
      }else if(this.pay_type === 'full_payment'){
        if(this.total_amt){
          this.paymentForm.controls['amount'].disable();
          this.paymentForm.value.amount = this.total_amt;
          this.paymentForm.value.transaction_receipt = this.receipt;  
           this.createOrderAPI();
        }
      }
    }  
  }

  createOrderAPI(){
        let order = JSON.parse(localStorage.getItem("order"));
        let results = order.order_items.filter((x,k) => {
          if(x.user_id === this.userData.id){
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
     
      if(this.pay_type === 'partial_payment'){
        this.paymentForm.value.part_payment = 'yes';
      }else{
        this.paymentForm.value.part_payment = 'no';
      }
      this.paymentForm.value.payment_instrument  = this.type;
      this.isLoginProcessing = true;
      if(this.orderId){
        this.orderPayment(this.orderId, this.paymentForm.value);
      }else{
        this.UserService.createOrder(element).subscribe({
          next: result => {
            if(result["success"] === true) {
              this.orderId = result['data'].id;
              this.orderPayment(this.orderId, this.paymentForm.value);
            } else {
              let msg = 'Create order process failed';
              this.toasterService.Error(msg);
              this.isLoginProcessing = false;
            }
          },
          error: err => {
            this.toasterService.Error(err);
            this.isLoginProcessing = false;
          },
          complete: () => {
          }
        });
      }
  }

  orderPayment(orderId, Values){
    const uploadData = new FormData();
    //uploadData.append('amount', this.paymentForm.value.amount.toFixed(2));
    uploadData.append('amount', Math.ceil(this.paymentForm.value.amount).toFixed());
    uploadData.append('transaction_number', this.paymentForm.value.transaction_number);
    uploadData.append('transaction_receipt', this.receipt);
    uploadData.append('part_payment', this.paymentForm.value.part_payment);
    uploadData.append('payment_instrument', this.paymentForm.value.payment_instrument);
    this.isLoginProcessing = true;
    this.UserService.manualPayment(API.PAYMENT.PAYMENT_API+'/'+orderId, uploadData, {}, 
      { contentType: { isFormDataContent: true } }).subscribe({
      next: result => {
        if(result.success === true) {
          this.payFailedStatus = false;
          this.Router.navigate(["process-completed"]);
          this.toasterService.Success(result["message"]);
        } else {
          this.payFailedStatus = true;
          let msg = 'Payment process failed';
          this.toasterService.Error(msg);
          this.isLoginProcessing = false;
        }
      },
      error: err => {
        this.payFailedStatus = true;
        this.toasterService.Error(err);
        this.isLoginProcessing = false;
      },
      complete: () => {
        //this.isLoginProcessing = false;
      }
    });
  }

  viewDetail(){
    this.Router.navigate(['/payment']);
  }

  toFixedFun(val){
    if(val){
      return Math.ceil(val).toFixed();
    }else{
      return 0;
    }
  }
}
