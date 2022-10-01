import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { UserService } from 'app/shared/services/user.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { RemoveAlertComponent } from 'app/dialog/remove-alert/remove-alert.component';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-catalogue',
  templateUrl: './add-catalogue.component.html',
  styleUrls: ['./add-catalogue.component.css']
})
export class AddCatalogueComponent implements OnInit,OnDestroy {


  //private catalogue_list: Array<any> = [];
  catalogue_list: Array<any> = [];
  catalogueList = [];
  offset = 0;
  limit = 10;
  catalogueArray = [];
  totalArrayLimit: any;
  connectLoader = true;
  cid: any;
   productList=[];
  dialogRef: MatDialogRef<RemoveAlertComponent>;
  productToggle=false;
  constructor(
    private UserService: UserService, 
    private ToasterService: ToasterService,
    private _api : ApiHandlerService,
    public dialog :MatDialog,
    private _route : ActivatedRoute,
    private router: Router,
    private location:Location,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
  
  ) { }
  ngOnDestroy(): void {
    console.log(this.router.url);
    if(this.router.url!='/create-catalogue'){
      sessionStorage.removeItem('catalogue');
    }
  }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('filterurl'));
    //console.log(JSON.parse(sessionStorage.getItem('catalogue')));
    this.getCatalogueList();
    this.cid = this._route.snapshot.paramMap.get('vid');
      console.log("add catalogue by product");
      this.productList=JSON.parse(sessionStorage.getItem('catalogue'));
      if(this.productList==null){
       this.productToggle=false;
      }
      else{
        this.productToggle=true;
      }
      console.log(this.productList);
  }

  AddCatalogue(){
    sessionStorage.setItem('AddCatalogue','/add-catalogue');
    if(this.cid){
      this.router.navigate(['/create-catalogue',this.cid]);
    }
    else{
      this.router.navigate(['/create-catalogue']);
    }
    
  }

  getCatalogueList(){
    this.connectLoader = true;
    this.UserService.getCatalogueList(this.offset, this.limit).subscribe(catalogueList=>{
      this.catalogue_list = [];
      if(catalogueList && catalogueList["data"] && catalogueList["data"]["rows"]){
        this.catalogue_list = catalogueList["data"].rows;
        this.connectLoader = false;
      }
    });   
  }

  

  getCataDetail(){
    this._api.apiGet(API.QUEST_ENDPOINTS.GET_CATALOGUE_DETAILS(this.cid)).subscribe({
      next:result => {
        this.catalogueArray = result.data.rows[0];
      }
    })
  }

  addProductIntoCatalogue(id){
    let catalogue_id = id;
    this._api.apiPost(API.QUEST_ENDPOINTS.ADD_PRODUCT_INTO_CATA(catalogue_id,this.cid), {}).subscribe({
      next: result =>{
        if(result.message){
          this.ToasterService.Success(result.message);
        }
      }
    })
  }

  addProductIntoCatalogueDialog(catalogue_id, catalogue_name){
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are you sure you want to add product into catalogue('+ catalogue_name +')?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if(result){

        this.UserService.addSingleProductCatalogue(catalogue_id , this.cid, {}).
        subscribe({next: result=>{
         if(result && result['message']){
           this.router.navigate(["/catalogue-product-list/",this.cid,catalogue_id]);
           this.ToasterService.Success(result['message']);
         }  
       },error: err=>{
           this.ToasterService.Error(err);
         }
       })

      }
    });  
  }

  getCatalogueProductListing(id){
    

     this.UserService.getCatalogueProduct(id).subscribe((res:any)=>{
      console.log(res);
      let obj;
      if(res.data.rows.length >0 && res.data.rows[0].product_variants.length >0){
        res.data.rows[0].product_variants.map((x:any)=>{
          if(this.productList.indexOf(x.id)==-1)
          this.productList.push(x.id);
         })
        console.log(this.productList);
      }

      let body = {
        variant_list:this.productList
      }

       this.UserService.addProductCatalogue(id, body).subscribe(addProductRes =>{
        if(addProductRes && addProductRes['message']){
          this.ToasterService.Success('Product added into catalogue successfully');
          this.router.navigate([sessionStorage.getItem('filterurl')],JSON.parse(sessionStorage.getItem('filterparam')));
        }
      })
      
      /*this.catalogueName = res["data"].rows[0].catalogue_name;
      if(res["data"].rows && res["data"].rows.length>0){
        let response : any = res
        let data = [];
        data = response.data.rows;
        this.preferredProductVariantImage(data, res["data"].total);
      }else{
        this.status = true;
      }
       */
    })
  }


  saveProducts(id){
    if(this.productList.length>0){
      this.getCatalogueProductListing(id);
      /*
      
      */
    }else{
      this.ToasterService.Warning('Please select at least one product');
    }
  }

}
