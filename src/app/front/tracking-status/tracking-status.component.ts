import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-tracking-status',
  templateUrl: './tracking-status.component.html',
  styleUrls: ['./tracking-status.component.css']
})
export class TrackingStatusComponent implements OnInit, AfterViewInit {

  orderId: any;
  shipment_detail: any;
  tracking_number: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  AWB_status: any;

  constructor(private UserService: UserService, private _route: ActivatedRoute, 
    private _formBuilder: FormBuilder, private ToasterService: ToasterService) { }

  ngOnInit(): void {
    this.orderId = this._route.snapshot.paramMap.get('id');
    this.getOrderDetail(this.orderId);
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  @ViewChild('stepper') stepper: MatStepper;
  ngAfterViewInit() {
    setTimeout(()=>{

    },0);
  }

  completeItem() {
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  getOrderDetail(orderID){
    this.UserService.orderDetail(orderID).subscribe(orderDetail=>{
      if(orderDetail["data"].order_shipments.length>0){
        this.shipment_detail = orderDetail["data"].order_shipments;
        this.AWB_status = this.shipment_detail[0];
        console.log(this.AWB_status);
        this.tracking_number = orderDetail["data"].tracking_number;
      }else{
        this.ToasterService.Warning('No shipment found');
      }
    });  
  }

  /*AWB(shipment_detail){
    console.log(shipment_detail[0]);
    console.log(shipment_detail[0].shipping_provider);
    if(shipment_detail[0].shipping_provider == 'SHIPROCKET_EM'){

    }else{

    }
  }*/

}
