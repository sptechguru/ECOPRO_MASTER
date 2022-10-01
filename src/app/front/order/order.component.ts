import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {

  //private order_list: Array<any> = [];
  //private tracking: any;
  order_list: Array<any> = [];
  tracking: any;
  offset = 0;
  limit = 10;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  connectLoader: boolean = false;

  constructor(private UserService: UserService, private ToasterService: ToasterService) { }

  ngOnInit(): void {
    this.getMyOrders();
  }

  getMyOrders(){
    this.connectLoader = true;
    this.UserService.getMyOrder(this.offset, this.limit).subscribe(orderList=>{
      this.order_list = orderList["data"].rows;
      this.connectLoader = false;
    });  
  }
  
  getOrderByStatus(status){
    this.connectLoader = true;
    if(status === ''){
      this.UserService.getMyOrder(this.offset, this.limit).subscribe(orderList=>{
        this.order_list = orderList["data"].rows;
        this.connectLoader = false;
      });  
    }else{
      this.UserService.getMyOrderFilterbyStatus(status).subscribe(orderList=>{
        if(orderList["data"].rows.length>0){
          this.order_list = orderList["data"].rows;
          this.connectLoader = false;
        }else{
          this.order_list = orderList["data"].rows;
          this.ToasterService.Error("No order found");
          this.connectLoader = false;
        }
      });
    }
  }

  orderSearchByTrackingNumber(){
    this.connectLoader = true;
    if(this.tracking){
      this.UserService.getMyOrderFilterbyTrackingNumber(this.tracking).subscribe(orderList=>{
        if(orderList["data"].rows.length>0){
          this.order_list = orderList["data"].rows;
          this.connectLoader = false;
        }else{
          this.ToasterService.Error("No order find of this tracking number");
          this.connectLoader = false;
        }
      });
    }else{
      this.ToasterService.Error("Please enter tracking number");
      this.connectLoader = false;
    }
  }

  onScrollDown(){
    this.offset += this.limit;
    this.UserService.getMyOrder(this.offset, this.limit).subscribe(orderList=>{
      //this.connectLoader = true;
      for (let j = 0; j < orderList["data"].rows.length; j++) {
        this.order_list['push'](orderList["data"].rows[j]);
        this.connectLoader = false;
      }  
    });  
  } 

  onScrollUp(){
    this.connectLoader = false;
  }

  toFixedFun(val){
    if(val){
      return Math.ceil(val).toFixed();
    }else{
      return 0;
    }
  }

}
