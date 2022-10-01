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
  selector: 'app-live-stock',
  templateUrl: './live-stock.component.html',
  styleUrls: ['./live-stock.component.css'],
  providers: [FrontHeaderComponent]
})
export class LiveStockComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  live_stock_data: any;
  inventory: any;
  vendorInventory: any;
  quantity: any;

  constructor(public matDialog: MatDialog, private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public sku_code: any,
    private _api : ApiHandlerService, private _alert : ToasterService,public translate: TranslateService,
    public dialog: FrontHeaderComponent, public dialogRef: MatDialogRef<LiveStockComponent>,
    public user: UserService
  ) { 
  }

  ngOnInit() {
    this.createFormValidation();
    this.getLiveStock();
  }

  createFormValidation() {
    this.forgotPasswordForm = this.fb.group({
      avl_quantity: [''],
      inventory: [''],
      vendor_inventory: [''],
    });
  }
  
  getLiveStock(){
    this.user.getLiveStock(this.sku_code).subscribe(livestock=>{
      let response : any = livestock;
      if(response.data){
        this.live_stock_data = response.data[this.sku_code];
        this.inventory = this.live_stock_data.live_stocks.inventory;
        this.vendorInventory = this.live_stock_data.live_stocks.vendorInventory;
        this.quantity = response.data[this.sku_code].quantity;
      }  
    });
  }

}
