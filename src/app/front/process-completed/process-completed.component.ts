import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-process-completed',
  templateUrl: './process-completed.component.html',
  styleUrls: ['./process-completed.component.css']
})
export class ProcessCompletedComponent implements OnInit {
  
  cartData: any;
  userData: any;

  constructor(private Router: Router, private location: LocationStrategy, 
    public localStorage : StorageAccessorService) { }

  ngOnInit(): void {
    if(localStorage.getItem('cartData')){
      this.cartData = JSON.parse(localStorage.getItem('cartData'));
    }  
    this.userData = this.localStorage.fetchData()["data"];
    let id = this.userData.id;
    let cart_data = [];
    if(this.cartData){
      this.cartData.map((item)=>{
        if (item.user_id != id){
          cart_data.push(item);
        }
      });
      this.cartData = cart_data;
      localStorage.setItem('cartData', JSON.stringify(this.cartData)); 
    }
    localStorage.removeItem("paymentArray")
    localStorage.removeItem('pendingOrderAmount');
    localStorage.removeItem('paid_amount');
    localStorage.removeItem('paymentMethodType');
    localStorage.removeItem('payment_order_id');
    if(localStorage.getItem('shipingPrice')){
      localStorage.removeItem("totalShipingPrice");
      localStorage.removeItem("shipingPrice");
      localStorage.removeItem("totalShippingTax");
    }
    localStorage.removeItem('pending_amount'); 
    localStorage.removeItem("part_payment");
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

}
