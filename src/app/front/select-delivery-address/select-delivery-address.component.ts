import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-select-delivery-address',
  templateUrl: './select-delivery-address.component.html',
  styleUrls: ['./select-delivery-address.component.css']
})
export class SelectDeliveryAddressComponent implements OnInit {

  addressList: any = [];
  selected_address: any;
  address_id: any;
  user_id: any;
  connectLoader = false;
  addressStatus: boolean;
  addressListArray: Array<any> = [];

  constructor( private toasterService: ToasterService,
    private user : UserService, private Router: Router, private _route: ActivatedRoute,
    public localStorage: StorageAccessorService) { }

  ngOnInit(): void {
    let userData = this.localStorage.fetchData();
    this.user_id = userData["data"].id;
    this.getDeliveryAddress(this.user_id);
  }

  getDeliveryAddress(user_id){
    this.user.getAddressList(user_id).subscribe((response:any)=>{
      if(response.success){
        if(response.data.rows.length>0){
          this.addressStatus = false;
          this.addressList = response.data.rows;
          this.addressList.forEach((vals, i)=> {
            if(vals.is_billing == "no"){
              this.addressListArray['push'](vals);
            }
          });
          let selected_address = this.addressList.filter((val, index) => {
            if(val.is_default === "yes"){
              return val;
            }
          });
          this.selected_address =  selected_address[0];
        }else{
          this.addressStatus = true;
        }
      }
      else{
        this.toasterService.Error(response.message);
      }
    })
  }

  selectAddress(selectAddress){
    this.selected_address = selectAddress;
  }

  saveAddress(){
    if(this.selected_address){
      let selected_address = this.addressList.filter((val, index) => {
        if(this.selected_address.id === val.id){
          val["is_default"] = "yes";
          delete val["created_at"];
          delete val["updated_at"];
          delete val["status"];
          return val;
        }else {
          val["is_default"] = "no";
          delete val["created_at"];
          delete val["updated_at"];
          delete val["status"];
          return val;
        }
      });
      selected_address.forEach((val, index ) => {
        this.saveAPI(val);
      });
    }else{
      this.toasterService.Error("Please select address");
    }
  }

  saveAPI(data){
    this.connectLoader = true;
    let address_id = data.id;
    let user_id = data.user_id;
      this.user.updateAddress(address_id, user_id, data).subscribe((response:any)=>{
        if(response.success === true){
          this.connectLoader = false;
          this.toasterService.Success("Address saved successfully");
          this.Router.navigate(["/delivery-detail"]); 
        }else{
          this.connectLoader = false;
          this.toasterService.Error(response.message);
        } 
      });
  }


  deliveryDetail(){
    this.Router.navigate(["/delivery-detail"]);  
  }

}
