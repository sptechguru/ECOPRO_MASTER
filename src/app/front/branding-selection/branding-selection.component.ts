import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-branding-selection',
  templateUrl: './branding-selection.component.html',
  styleUrls: ['./branding-selection.component.css']
})
export class BrandingSelectionComponent implements OnInit {
 
  id: any;
  pid: any;
  vid: any;
  cartData: any;
  userData: any;

  constructor(private router: Router,  private _route : ActivatedRoute, 
    public localStorage : StorageAccessorService){}

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.pid = this._route.snapshot.paramMap.get('pid');
    this.vid = this._route.snapshot.paramMap.get('vid');
    this.cartData = JSON.parse(localStorage.getItem('cartData'));
    let user_data = this.localStorage.fetchData();
    this.userData = user_data["data"];
  }

  setBranding(type){
    this.cartData.forEach((data,index) => {
      if(data.vid === this.vid && data.user_id === this.userData.id){
        data["is_branding"] = type;
      }
    })
    localStorage.setItem('cartData',JSON.stringify(this.cartData));
    this.router.navigate(['/cart'])
  }
}
