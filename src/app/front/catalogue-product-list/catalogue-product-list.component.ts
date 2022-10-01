import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoveAlertComponent } from 'app/dialog/remove-alert/remove-alert.component';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { environment } from 'environments/environment';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { SortByPipe } from 'app/shared/pipes/product-list-sort.pipe';

@Component({
  selector: 'app-catalogue-product-list',
  templateUrl: './catalogue-product-list.component.html',
  styleUrls: ['./catalogue-product-list.component.css'],
  providers: [SortByPipe]
})
export class CatalogueProductListComponent implements OnInit {

    productList = [];
    product_list: any = [];
    productVarient: any = [];
    productVarientImage: any = [];
    variant_list:any=[];
    tempProductArray: any;
    totalArrayLimit: any;
    totalArrayLimitVarient= [];
    connectLoader = true;
    imageProduct = {};  
    catalogueName: any;
    imageArray: [] ;
    dialogRef: MatDialogRef<RemoveAlertComponent>;
    catalogueId: [];
    variantId: [];
    tempProductListArr = [];
    default_image :any;
    status: any;
    cid: any;
    catalogue_id: any;
    catalogueProductList: any;
    currentLimit: any;
    margins: any;
    all_margin: any;
    all_margin_type: any;
    margin_types: any;
    downloadlink: any;

    constructor(
      private ToasterService: ToasterService, 
      private Router: Router,
      public userService: UserService,
      private _route : ActivatedRoute,
      public dialog :MatDialog,
      public confirmationDialogHandlerService: ConfirmationDialogHandlerService
    ) { }

    ngOnInit(): void {
      this.getCatalogueProductListing();
      this.all_margin_type = 'percent';
      this.cid = this._route.snapshot.paramMap.get('cid');
      this.catalogue_id = this._route.snapshot.paramMap.get('id');
      this.getCatalogueDownloadLink(this.catalogue_id);
      this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
    }

    getCatalogueDownloadLink(id){
      this.userService.downloadCatalogue(id).subscribe({next:response => {
        if(response["success"] == true){
          if(response["data"]){
            this.downloadlink = environment.baseUrl+''+response["data"];
          }
        }
      },
      error: err=>{
        this.downloadlink = '';
      }   
      });
    }
    
    getCatalogueProductListing(){
      this.connectLoader = true;
      this.productVarient = [];
      this.tempProductArray = [];
      this.tempProductListArr = [];
      var catalogue_id = this._route.snapshot.paramMap.get('id');
      this.userService.getCatalogueProduct(catalogue_id).subscribe(productVarient=>{
        this.connectLoader = false;
        this.catalogueName = productVarient["data"].rows[0].catalogue_name;
        if(productVarient["data"].rows && productVarient["data"].rows.length>0){
          let response : any = productVarient
          let data = [];
          data = response.data.rows;
          this.preferredProductVariantImage(data, productVarient["data"].total);
        }else{
          this.status = true;
        }
        this.totalArrayLimit = this.tempProductListArr.length; 
      })
    }

    preferredProductVariantImage(data, total){
      this.tempProductListArr = [];
      data.forEach((product, i)=>{ 
        if(product.product_variants.length>0){
          product.product_variants.forEach((variant, j)=>{ 
            if(variant.product_images.length>0){
            let results = variant.product_images.filter((x,k) => {
              if(x.is_feature == "yes"){
                return x.is_feature && x.product_variant_image_150x150;
              }
            }); 
            if(results.length>0){
              this.tempProductListArr.push({
                product_name: results[0].product_name,
                product_variants: variant, featured_image: results[0].product_variant_image_150x150, 
                is_feature: results[0].is_feature, id: variant.id}) 
            }else{
              if(variant.product_images[0].product_variant_image_150x150){
                this.tempProductListArr.push({
                  product_name: product.product_name,
                  product_variants: variant, featured_image: variant.product_images[0].product_variant_image_150x150, 
                  is_feature: 'no', id: variant.id})
              }else{
                this.tempProductListArr.push({
                  product_name: product.product_name,
                  product_variants: variant, featured_image: this.default_image, 
                  is_feature: 'no', id: variant.id})
              }
            }
          }else{
            let result3 = this.default_image;
            this.tempProductListArr.push({
              product_variants: variant, featured_image: result3, 
              is_feature: 'no', id: variant.id}) 
          }
        }); 
       }else{
          //this.toasterService.Warning("Product variant not found");
       } 
      }); 
       this.totalArrayLimit = total;
       //this.totalArrayLimit = this.tempProductListArr.length;
       this.catalogueProductList = this.tempProductListArr;
       this.currentLimit = this.catalogueProductList.length;
       this.connectLoader = false;
    }

    openRemoveProduct(catalogue_id,variant_id){
      let data; 
      this.dialogRef = this.dialog.open(RemoveAlertComponent, {
        data: {val: catalogue_id}
      })
      this.dialogRef.afterClosed().subscribe(catalogue_id => {
       if(catalogue_id){
         this.userService.removeAddCataProduct(catalogue_id , variant_id, data).
         subscribe({next: result=>{
          if(result && result['message']){
            this.getCatalogueProductListing();
            this.getCatalogueDownloadLink(this.catalogue_id);
            this.ToasterService.Success('Product remove successfully');
          }  
        },error: err=>{
            this.ToasterService.Error("Something went wrong");
          }
        })
          this.dialogRef = null;
        }
      });
    }

    addAllMargin(){
      if(this.all_margin){
        this.confirmationDialogHandlerService.openDialog({
          question: 'Are you sure you want to apply margin on all products?',
          confirmText: 'Yes',
          cancelText: 'No'
        }).subscribe((result) => {
          if(result){
            let data = {
              catalogue_id: this.catalogue_id,
              variant_id: '',
              margin: this.all_margin.toString(),
              margin_type: this.all_margin_type,
              margin_for: "all"
            };
            this.connectLoader = true;
            this.userService.addMarginIntoCatalogueProduct(data).
              subscribe({next: result=>{
              if(result["success"] === true){
                this.connectLoader = false;
                this.ToasterService.Success(result["message"]);
                this.getCatalogueProductListing();
                this.getCatalogueDownloadLink(this.catalogue_id);
              }  
              },error: err=>{
                  this.connectLoader = false;
                  this.ToasterService.Error(err);
              },complete: () => {
                this.connectLoader = false;
              }
           })  
          }
        });
      }else{
        this.ToasterService.Error("Please enter margin value");
      }    
    }
  
    marginsEnter(data){
      if(data){
        this.margins = data;
      }
    }

    changeMarginType(e){
      if(e.value){
        this.margin_types = e.value;
      }
    }
  
    addMargin(variant){
      if(this.margins || this.margin_types){
        let data = {
          catalogue_id: this.catalogue_id,
          variant_id: variant.id.toString(),
          margin: variant.catalogues_product.margin.toString(),
          margin_type: variant.catalogues_product.margin_type,
          margin_for: "single"
        };
        this.connectLoader = true;
        this.userService.addMarginIntoCatalogueProduct(data).subscribe(result=>{
          if(result["success"] === true){
            this.connectLoader = false;
            this.ToasterService.Success(result["message"]);
            this.getCatalogueDownloadLink(this.catalogue_id);
          }else{
            this.connectLoader = false;
          }       
        })
      }else{
        this.ToasterService.Warning("Please update margin value or margin type");
      }
    }
  
    marginRemove(){
      this.all_margin = '';
      this.all_margin_type = "percent";
    }
  

}
