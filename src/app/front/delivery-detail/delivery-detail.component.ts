import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import * as moment from 'moment';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css']
})
export class DeliveryDetailComponent implements OnInit {
  delivery_day_list=[];
  delivery_type: any;
  delivery_address: any;
  cartData: any;
  cartTotal;
  address_id: any;
  addressList: any;
  user_id: any;
  selected_address: any;
  GST_amount: any;
  pincode: any;
  shipingPrice: any;
  chargess: any;
  isProcessing: boolean = false;
  skuCodeShippingPrice: any;
  billing_title: any;
  billing_address: any;
  case: any;
  totalShippingTax: any;
  totalShipping: any;

  constructor(private ToasterService: ToasterService, private Router: Router,  private user : UserService,
    public localStorage : StorageAccessorService) { }

  
  ngOnInit(): void {
    //this.delivery_type = "self_pickup";
    this.delivery_type = "logistic_delevery";
    let userData = this.localStorage.fetchData();
    this.user_id = userData["data"].id;
    this.chargess = 'express';
    this.case = 'different';
    this.getDeliveryAddress(this.user_id, 'express');
    this.cartData = JSON.parse(localStorage.getItem('cartData'));
    console.log(this.cartData);
    
    this.getCartTotal();
    this.calculateGSTAmount();
  }

  charges(value){
    if(value == 'express'){
      this.chargess = 'express';
      this.getDeliveryAddress(this.user_id, this.chargess);
    }else if(value == 'custom'){
      this.chargess = 'custom';
      this.getDeliveryAddress(this.user_id, this.chargess);
    }
  }

  addressSame(e){
    if(e.checked === true){
      this.case = 'same';
      this.getDeliveryAddress(this.user_id, this.chargess);
    }else{
      this.case = 'different';
      this.getDeliveryAddress(this.user_id, this.chargess);
    }
  }

  getDeliveryAddress(user_id, chargess){
    this.isProcessing = true;
    this.user.getAddressList(user_id).subscribe((response:any)=>{
      if(response.success){
        if(response.data.rows.length>0){
          this.isProcessing = false;
          this.addressList = response.data.rows;
          let d = this.addressList.filter(function (item) {
            return item.is_billing === "yes";
          });
          let selected_address;
          if(d.length>0){
            this.billing_title = d[0].title; 
            this.billing_address = d[0].address_line_1; 
            selected_address = this.addressList.filter((val, index) => {
              if(val.is_default === "yes" && this.case === 'different'){
                return val;
              }
              if(val.is_billing === "yes" && this.case === 'same'){
                 return val; 
              }
            });
          }else{
            selected_address = this.addressList.filter((val, index) => {
              if(val.is_default === "yes"){
                return val;
              }
            });
          }
          
          if(selected_address[0]){
            this.selected_address =  selected_address[0];
            this.pincode = selected_address[0].pincode;
          }else{
            this.selected_address =  '';
            this.pincode = '';
          }
          for(let i=0;i<this.cartData.length;i++){
            this.submitDeliveryForm(this.cartData[i],i);
          }
         
          let priceCalculateArray = [];
          this.cartData.forEach(element => {
           if(element.user_id === this.user_id){
            let display_dimension_with_packing = element.display_dimension_with_packing.split('x');
            let L = display_dimension_with_packing[0];
            let W = display_dimension_with_packing[1];
            let H = display_dimension_with_packing[2];
            priceCalculateArray.push({
              sku_code: element.item_sku, 
              quantity: element.quantity, 
              destinationPin: this.pincode, 
              length: parseFloat(L), 
              width: parseFloat(W),
              height: parseFloat(H), 
              weight: parseFloat(element.weight_with_packing)
            });
            }
          });
          let price_calculate = {};
          price_calculate["price_calculate"] = priceCalculateArray;
          this.isProcessing = true;
          this.shipingPrice = '';
          if(chargess == 'express'){
            this.user.priceCalculator(price_calculate).subscribe({
              next: price => {
                if(price["success"] === true){ 
                  if(price["data"]){
                    this.isProcessing = false;
                    this.shipingPrice = price["data"].shipingPrice;
                    this.totalShippingTax = price["data"].totalShipingtax;
                    this.totalShipping = this.shipingPrice + this.totalShippingTax;

                    this.skuCodeShippingPrice = price["data"].itemsShipingCharge;
                    localStorage.setItem("totalShipingPrice", this.totalShipping);
                    localStorage.setItem("shipingPrice", this.shipingPrice);
                    localStorage.setItem("totalShippingTax", this.totalShippingTax);
                  } 
                }else{
                  this.isProcessing = false;
                  this.ToasterService.Error(price["message"]);
                }  
            },
            error: err => {
              this.isProcessing = false;
              this.ToasterService.Error(err);
            },
            complete: () => {
              
            }
          });   
          }else if(chargess == 'custom'){
            this.shipingPrice = 0;
            this.totalShippingTax = 0;
            this.totalShipping = 0;
            this.isProcessing = false;
            localStorage.setItem("totalShipingPrice", this.totalShipping);
            localStorage.setItem("shipingPrice", this.shipingPrice);
            localStorage.setItem("totalShippingTax", this.totalShippingTax);
          }
        }
      }
      else{
        this.isProcessing = false;
        this.ToasterService.Error(response.message);
      }
    })
  }

  deliveryType(value){
    if(value === 'self_pickup'){
      this.delivery_type = "self_pickup";
    }else if(value === 'manual_payment'){
      this.delivery_type = "logistic_delevery";
    }
  }

  deliveryDetail(){
    if(this.selected_address){
      if(this.totalShipping){
        let orderData = this.selected_address;
        let cartData = JSON.parse(localStorage.getItem('cartData'));
       
        if(cartData){
          var element = {};
          element["user_address_id"] = orderData.id;
          element["delivery_type"] = this.delivery_type;
          element["delivery_charges"] = this.shipingPrice;
          element["total_shipping_tax"] = this.totalShippingTax;
          element["shipping_type"] = this.chargess;
          cartData.forEach((cart, index)=> {
            this.skuCodeShippingPrice.forEach((price, index2) => {
              if(cart.item_sku == price.sku_code){
                cartData[index]["item_shipping_charges"] = price.shiping_price;
              }
            });
          });
          for (let key in cartData) {
            delete cartData[key].vid;
            delete cartData[key].pid;
            delete cartData[key].cart_type;
            delete cartData[key].cid;
            delete cartData[key].product_name;
            delete cartData[key].variant_image;
            delete cartData[key].destinationPin;
            delete cartData[key].display_dimension_with_packing;
            delete cartData[key].weight_with_packing;
          }
          element["order_items"] = cartData;
          localStorage.setItem("order", JSON.stringify(element));
          this.Router.navigate(["/checkout"]);
        }   
      }else if(this.shipingPrice == 0){
        let orderData = this.selected_address;
        let cartData = JSON.parse(localStorage.getItem('cartData'));
        if(cartData){
          var element = {};
          element["user_address_id"] = orderData.id;
          element["delivery_type"] = this.delivery_type;
          element["delivery_charges"] = this.shipingPrice;
          element["total_shiping_tax"] = this.totalShippingTax;
          element["shipping_type"] = this.chargess;
          cartData.forEach((cart, index)=> {
            this.skuCodeShippingPrice.forEach((price, index2) => {
              if(cart.item_sku == price.sku_code){
                cartData[index]["item_shipping_charges"] = 0;
              }
            });
          });
          for (let key in cartData) {
            delete cartData[key].vid;
            delete cartData[key].pid;
            delete cartData[key].cart_type;
            delete cartData[key].cid;
            delete cartData[key].product_name;
            delete cartData[key].variant_image;
            delete cartData[key].destinationPin;
            delete cartData[key].display_dimension_with_packing;
            delete cartData[key].weight_with_packing;
          }
          element["order_items"] = cartData;
          localStorage.setItem("order", JSON.stringify(element));
          this.Router.navigate(["/checkout"]);
        }   
      }else{
        this.ToasterService.Warning("Shipping price is missing.");
      }
    }else{
      this.ToasterService.Error("Please select delivery address");
    }
  }

  getCartTotal(){
    this.cartTotal = 0;
    this.cartData.forEach((data) => {
      if(data.user_id === this.user_id){
        this.cartTotal += data.sale_price * data.quantity;
      } 
    })
  }

  calculateGSTAmount(){
    this.GST_amount = 0;
    this.cartData.forEach((data) => {
      if(data.user_id === this.user_id){
        let amounts = Math.ceil(((data.sale_price * data.quantity)*data.gst)/100).toFixed();
        this.GST_amount += Number(amounts);
      }  
    })
  }

  changeAddress(){
    this.Router.navigate(["/select-delivery-address"]);
  }

  viewDetail(){
    this.Router.navigate(['/cart']);
  }

  toFixedFun(val){
    if(val){
      return Math.ceil(val).toFixed();
    }else{
      return 0;
    }
  }
  async submitDeliveryForm(i,j){
    console.log("delivery status");
  let formData={pincode:this.pincode,unite:i.quantity}
  let sku_code=i.item_sku;
  let shipmentTiming;
  let live_stock_inventory;
  await this.user.getDeliveryETA(formData.pincode, formData.unite).subscribe(async(data) => {
    try {
        shipmentTiming = await data['data']['shipping_zone']['shipping_timings'][0];
    } catch(err) {
        this.delivery_day_list[j] = 'Invalid Pincode';
        console.log(this.delivery_day_list)
        return;
    }

    await this.user.getLiveStock(sku_code).subscribe(async (livestock) => {
        live_stock_inventory = i.ready_stock
        let min_eta = shipmentTiming['min_ready_eta'];
        let max_eta = shipmentTiming['max_ready_eta'];
        let diff_extra_qty = 0;
        let leadTime = {};
       

        if (formData.unite > live_stock_inventory) {
            diff_extra_qty = formData.unite - live_stock_inventory;
            leadTime = i.lead_times.find(ele => ele.min_quantity >= diff_extra_qty && ele.max_quantity >= diff_extra_qty);

            if(typeof leadTime === 'undefined'){
                leadTime = {"min_eta":0, "max_eta":0}
            }
            min_eta = min_eta + leadTime['min_eta'];
            max_eta = max_eta + leadTime['max_eta'];
        }

        this.delivery_day_list[j] = `${ min_eta }-${ max_eta } days between ${ moment().add(min_eta, 'days').format('DD MMM') } and ${ moment().add(max_eta, 'days').format('DD MMM') }`;
        
      });
});

}


}
