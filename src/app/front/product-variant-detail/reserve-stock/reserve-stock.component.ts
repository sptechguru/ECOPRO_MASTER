import { Component, OnInit, Inject } from '@angular/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { error_msg } from 'app/shared/constants/consts';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from 'app/front/front-header/dialog/dialog.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FrontHeaderComponent } from 'app/front/front-header/front-header.component';
import { FormGroup, FormBuilder, Validators ,FormControl} from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-reserve-stock',
  templateUrl: './reserve-stock.component.html',
  styleUrls: ['./reserve-stock.component.css'],
  providers: [FrontHeaderComponent]
})
export class ReserveStockComponent implements OnInit {

  reserve_stock: any;
  delivery_time_in_days: any;
  total_stock: any;
  live_stock: any;
  live_stock_data: any;
  inventory: any;
  vendorInventory: any;
  quantity: any;
  total: any;
  live_stock_dishpatch_time: any;
  minimum_quantity_of_reserve_stock: any;
  minimum_order_quantity: any;

  constructor(public matDialog: MatDialog, private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public sku_code: any,
    private _api : ApiHandlerService, private _alert : ToasterService,public translate: TranslateService,
    public dialog: FrontHeaderComponent, public dialogRef: MatDialogRef<ReserveStockComponent>,
    public user: UserService
  ) {}

  ngOnInit() {
    this.getLiveStock();
  }
 
  getLiveStock(){
    let data =  this.sku_code.split('=');
    this.reserve_stock = data[0];
    this.delivery_time_in_days = data[1];
    let sku_code = data[2];
    this.live_stock_dishpatch_time = data[3];
    this.minimum_quantity_of_reserve_stock = data[4];
    this.minimum_order_quantity = data[5];
    this.user.getLiveStock(sku_code).subscribe(livestock=>{
      let response : any = livestock;
      if(response.data){
        this.live_stock_data = response.data[sku_code];
        this.inventory = this.live_stock_data.live_stocks.inventory;
        this.vendorInventory = this.live_stock_data.live_stocks.vendorInventory;
        this.quantity = response.data[sku_code].quantity;
        this.total = Number(this.quantity) + Number(this.reserve_stock);
      } else{
        this.quantity = 0;
      } 
    });
  }

}
