import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
  addressList = [];
  connectLoader = false;
  constructor(
    private toasterService: ToasterService,
    private user: UserService,
    public localStorage : StorageAccessorService
  ) { }

  ngOnInit(): void {
    this.getAddressList();
  }

  getAddressList(){
    // const id = this._route.snapshot.paramMap.get('id');
    this.connectLoader = true
    let userData = this.localStorage.fetchData();
    this.user.getAddressList(userData["data"].id).subscribe((response:any)=>{
      if(response.success){
        this.addressList = response.data.rows 
        this.connectLoader = false;
        // this.model.country_id = '1';
      }
      else{
        this.toasterService.Error(response.message);
        this.connectLoader = false;
      }
    })
  }
  
}
