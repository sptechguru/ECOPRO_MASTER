import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { httpTranslateLoader } from 'app/app.module';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { API } from 'app/shared/constants/endpoints';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartData;
  cartTotal;
  branding_yes: any;
  branding_no: any;
  quantity_status: any;
  branding: any;
  default_image: any;
  userData: any;
  ship_days: any;

  constructor(
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    private toasterService: ToasterService, private Router: Router,  
    public localStorage : StorageAccessorService)
  { }

  ngOnInit(): void {
    this.getCartData();
    this.userData = this.localStorage.fetchData()["data"];
    this.getCartTotal();
    if(localStorage.getItem('paymentArray')){
      localStorage.removeItem("paymentArray");
    }
    if(JSON.parse(localStorage.getItem('pendingOrderAmount'))){
      localStorage.removeItem('pendingOrderAmount');
      localStorage.removeItem('paid_amount');
      localStorage.removeItem('pending_amount');
    }
    if(JSON.parse(localStorage.getItem('payment_order_id'))){
      localStorage.removeItem('paymentMethodType');
      localStorage.removeItem('payment_order_id');
    }
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
  }

  getCartData(){
    this.cartData = JSON.parse(localStorage.getItem('cartData'));
    console.log(this.cartData);
  }
  
  removeItem(data, index){
    this.branding_yes = '';
    this.branding_no = '';
    this.branding = '';
    let name = data.product_name + ' - ' + data.variant_name;
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are you sure you want to remove ' + name + ' from cart?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if(result){
        this.cartData.splice(index, 1);
        localStorage.setItem('cartData',JSON.stringify(this.cartData));
        if(this.cartData.length>0){
          let result2 = this.cartData.filter((x,k) => {
            if(x.user_id === this.userData.id){
              return this.cartData;
            }
          });
          if(result2.length === 0){
            this.Router.navigate(['/categories']);
          }
        }else if(this.cartData.length === 0){
          this.Router.navigate(['/categories']);
        }
        this.getCartTotal();
      }
    })
  }

  getCartTotal(){
    this.cartTotal = 0;
    this.cartData.forEach((data) => {
      if(data.user_id == this.userData.id){
        this.cartTotal += data.sale_price * data.quantity;
      }  
    })
  }

  proceed(){
    this.quantity_status = true;
    this.cartData.filter(item=>{
     if(item.user_id == this.userData.id){
      if(item.quantity > 0){
        if(item.cart_type == 'add_cart'){

        //  debugger;
        if(item.quantity > item.ready_stock){         
          if (item.lead_times.length > 0) {           
            if (item.quantity > item.lead_times.at(-1).max_quantity) {
              this.quantity_status = false;
              this.toasterService.Error("You have exceed limit of available quantity in Ready Stock and Made to Order Stock");
              return false;              
            }

          }
        }
          if(item.quantity < item.minimum_order_quantity){
            this.quantity_status = false;
            this.toasterService.Error("Quantity should not be less than of minimum order quantity "+item.variant_name);
            return false;
          }else if(item.quantity <= 0){
            this.quantity_status = false;
            this.toasterService.Error('Please enter valid quantity '+item.variant_name);
            return false;
          }
          
          else if(item.lead_times.length==0 && item.quantity > item.available_quantity){
            this.quantity_status = false;
            this.toasterService.Error("You have exceed limit of available quantity in Ready Stock and Made to Order Stock"+item.variant_name);
            return false;
          }
         else if(item.lead_times.length > 0 && item.quantity > item.lead_times.at(-1).max_quantity && item.quantity < item.ready_stock){
          this.quantity_status = false;
          this.toasterService.Error("You have exceed limit of available quantity in Ready Stock and Made to Order Stock"+item.variant_name);
          return false;  
         }
         /* else if(item.quantity > item.available_quantity){
            console.log("run for lead");
            
            if(item.quantity > item.reserve_stock_quantity){
              this.quantity_status = false;
              this.toasterService.Error("You have exceed limit of available quantity in Ready Stock and Made to Order Stock "+item.variant_name);
              return false;
            }
            
          }
          */else if(item.quantity > item.available_quantity
            && item.quantity < item.minimum_quantity_of_reserve_stock){
            this.quantity_status = false;
            this.toasterService.Error("Quantity should not be less than of minimum order quantity of reserve stock "+item.variant_name);
            return false;
          }
        }
        
        if(item.cart_type == 'get_sample'){
          if(item.quantity <= 0){
            this.quantity_status = false;
            this.toasterService.Error("Please enter valid quantity "+item.variant_name);
            return false;
          }else if(item.quantity > 2){
            this.quantity_status = false;
            this.toasterService.Error("Quantity should be less than or equal to two of "+item.variant_name);
            return false;
          }
        }
      }else{
        this.quantity_status = false;
        this.toasterService.Error("Please enter valid quantity of "+item.variant_name);
        return false;
      }
     } 
    });

    if(this.quantity_status){
      let userId = this.localStorage.fetchData()["data"].id;
      let is_branding = this.cartData.filter(function (x) {
        if(x.user_id == userId){
          return x.is_branding === "yes";
        }    
      });

      let no_branding = this.cartData.filter(function (x) {
        if(x.user_id == userId){
          return x.is_branding === "no";
        }  
      });

      if(is_branding.length>0 && no_branding.length>0){
        this.toasterService.Error('Please choose either branding product or non branding product');
      }else{
        this.Router.navigate(['/delivery-detail']);
      }
    }
  }

  customOfferPrice(i,quantity) {
    console.log("custom price");
    if (this.cartData[i]?.view_flat_price === 'yes') {
      this.cartData[i].sale_price=this.cartData[i].base_price;
    } else {
      if(this.cartData[i].offer_prices.length > 0){
        let qty = parseInt(quantity.toString());
        let offer_price = this.cartData[i].offer_prices.find(rec => rec.min_quantity <= qty && rec.max_quantity >= qty);
        this.cartData[i].sale_price=offer_price?.offer_price || this.cartData[i].base_price;
      }
      else{
        this.cartData[i].sale_price=this.cartData[i].base_price;
      }
        
    }
}

  modelChanged(e, i, quantity){
    if(quantity){
      this.customOfferPrice(i,quantity);
    }
    
    this.cartData.filter(item=>{     
      if(item.user_id == this.userData.id){
        //if(quantity > item.ready_stock){         
        //   if (item.lead_times.length > 0) {           
        //     if (quantity > item.lead_times.at(-1).max_quantity) {
        //       this.confirmationDialogHandlerService
        //       .openDialog({
        //           question:
        //               "You have exceed limit of available quantity in Ready Stock and Made to Order Stock",
        //           confirmText: "Ok",
        //           cancelText: "Cancel",
        //       })
        //       .subscribe((result) => {
        //           if (result) {
        //           }
        //       });
        //     }

        //   }
        // }
       if(item.quantity > 0){
        if(quantity > item.available_quantity && quantity <= item.reserve_stock_quantity){
          if(item.reserve_stock_dispatch_time > 0 && item.minimum_quantity_of_reserve_stock == 0){
            item["ship_days"] = item.reserve_stock_dispatch_time;
          }
          if(item.reserve_stock_dispatch_time > 0 && item.minimum_quantity_of_reserve_stock > 0){
            item["ship_days"] = item.reserve_stock_dispatch_time;
          }
        }else if(quantity <= item.available_quantity){
            item["ship_days"] = item.live_stock_dispatch_time;
        }
       }
      }
    });  
    
    e == 0 ? this.cartData.splice(i,1) : void(0);
    localStorage.setItem('cartData',JSON.stringify(this.cartData));
    this.getCartTotal();
    if(this.cartData.length === 0){
      this.toasterService.Error('Your cart is empty because quantity 0 is not valid');
      this.Router.navigate(['/categories']);
    }

  }

  viewDetail(){
    this.Router.navigate(['/categories']);
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
