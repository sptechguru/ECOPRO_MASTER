import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { DialogService } from '../front-header/dialog/dialog.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LiveStockComponent } from './live-stock/live-stock.component';
import { ReserveStockComponent } from './reserve-stock/reserve-stock.component';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-product-variant-detail',
  templateUrl: './product-variant-detail.component.html',
  styleUrls: ['./product-variant-detail.component.css']
})
export class ProductVariantDetailComponent implements OnInit {

  enableZoom: Boolean = true;
  previewImageSrc = 'pathToImage';
  zoomImageSrc = 'pathToImage';
  myThumbnail="https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  myFullresImage="https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";

  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "asNavFor": '.product-slider-nav',
    "infinite": false,
    "arrows": false,
    "fade": true
    };
    slideConfig2 = {
      "slidesToShow": 4,
      "slidesToScroll": 1,
      "dots": false,
      "asNavFor": '.product-slider',
      "infinite": false,
      "swipeToSlide": true,
      "mobileFirst": true,
      "focusOnSelect": true,
    };
  slideConfig1 = {
    "slidesToScroll": 1,
    "dots": false,
    "infinite": false,
    "swipeToSlide": true,
    "mobileFirst": true,
    responsive: [
      {
      breakpoint: 992,
      settings: {
        slidesToShow: 5,
      }
 
    },  
     {
 
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
      }
 
    },
    {
 
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 574,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
  };
   
  selected;
  quantity = 1;
  id;
  vid;
  pid;
  is_sample: any;
  tempProductListArr = [];
  totalArrayLimit:any;
  arrayLimit:any;
  preferedProductList= [];
  currentLimit:any;
  quantity_status: boolean = true;
  default_image: any;
  product_category: any;
  variant_name: any;
  featuredImage: any;
  featuredFullImage: any;
  connectLoader: boolean;
  userData: any;
  cartData: any;
  variant_description: any;
  minimum_order_quantity: any;
  live_stock_data: any;
  available_qty: any;
  variantSliderImage: any;
  variantSliderImageStatus: boolean;
  productAttributeArray: Array<any>;
  att: any;
  youtubeUrl: any;
  youtubeUrlStatus: boolean;
  reserve_stock: any;
  live_stock_qty: any;
  live_stock_dishpatch_time;
  minimum_quantity_of_reserve_stock;
  reserve_stocks2;
  reserve_stock_dishpatch_time;
  phone_number: any;
  base_url: any;
  text: any;

  constructor(
    private _route : ActivatedRoute,
    private _api : ApiHandlerService,
    private fb: FormBuilder ,
    public translate: TranslateService,
    public localStorage: StorageAccessorService,
    private toasterService: ToasterService,
    private router: Router,
    private user: UserService,
    private commModel: DialogService,
    public matDialog: MatDialog,
    public dialogRef: MatDialogRef<ProductVariantDetailComponent>,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService
  ) {
    this.base_url = environment.baseUrl+''+router.url;
   }
   
  productDetails: any = { data : {}}
  product:any = [];
  cartType: any;

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('deals_id');
    this.pid = this._route.snapshot.paramMap.get('pid');
    this.vid = this._route.snapshot.paramMap.get('vid');
   // this.selected = 'Iphone X 64 GB';
    this.allProductDetails(this.id, this.pid, this.vid);
    this.categoriesPreferredList();
    if(localStorage.getItem('cartData')){
      this.cartData = JSON.parse(localStorage.getItem('cartData'));
    }
    this.userData = this.localStorage.fetchData()["data"];
    this.phone_number = '+91' +this.userData.phone_number;
    this.arrayLimit = 10;
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
  }

  /*---------------------- get product detail by id -------------------*/
   allProductDetails(id, pid, vid){
     this.connectLoader = true;
     this.id = id;
     this.pid = pid;
     this.vid = vid;
     this.user.getProductVariantDetails(this.pid, this.vid).subscribe(productDetails=>{
      let response : any = productDetails
      let data = []
      data = response.data
      this.product = response.data;
      console.log(this.product);
      this.reserve_stock = response.data.reserve_stock;
      //this.product_category = this.product.master_product_category.product_category;
      this.changeSelected();
      this.connectLoader = false;

      if(this.product.attribute_values.length>0){
        this.product.attribute_values.forEach(element => {
          let tempArray:any;
          if(!element.dataEntered && element.master_product_attribute){
            tempArray =
              {
                attribute_name:element.master_product_attribute.product_attribute,
                attribute_value:[element.attribute_value]
              }
          }
          element.dataEntered = true;
          this.product.attribute_values.forEach(checker => {
            if(!checker.dataEntered){
              if(element.master_product_attribute && checker.master_product_attribute){
                if(element.master_product_attribute.id == checker.master_product_attribute.id){
                  tempArray.attribute_value.push(checker.attribute_value);
                  checker.dataEntered = true;
                }
              }
             
            }
          });
          !this.product.variant_attribute ? this.product.variant_attribute = []:void(0);
          tempArray ? this.product.variant_attribute.push(tempArray) : void(0);
        });
      }

       this.youtubeUrl =  this.product.youtube_link;
            if( this.product.product_images.length>0){
              this.variantSliderImage =  this.product;
              this.variantSliderImageStatus = true;
              let results =  this.product.product_images.filter((x,k) => {
                if(x.is_feature === "yes"){
                  return x.is_feature && x.product_variant_image_150x150;
                }
              }); 
              /*let result2 =  this.product.product_images.filter((x,k) => {
                if(x.is_feature === "no"){
                  return x.is_feature && x.product_variant_image_150x150;
                }
              });*/
  
              if(results.length>0){
                this.featuredImage = results[0].product_variant_image_500x500;
                this.featuredFullImage = results[0].product_variant_image;
              }else{
                //this.featuredImage = result2[0].product_variant_image_500x500;
                //this.featuredFullImage = result2[0].product_variant_image;
                this.featuredImage = this.product[0].product_variant_image_500x500;
                this.featuredFullImage = this.product[0].product_variant_image;
              }
            }else{
              let result3 = this.default_image;
              this.featuredImage = result3;
              this.featuredFullImage = result3;
              this.variantSliderImage = this.default_image;
              this.variantSliderImageStatus = false;
            }

          /*--------------------- variant attributes list ---------------------*/

          if(this.product.attribute_values.length > 0){
            this.product.attribute_values.forEach(element => {
              let tempArray:any;
              if(!element.dataEntered && element.master_product_attribute){
                tempArray =
                  {
                    attribute_name:element.master_product_attribute.product_attribute,
                    attribute_value:[element.attribute_value]
                  }
              }
              element.dataEntered = true;
              this.product.attribute_values.forEach(checker => {
                if(!checker.dataEntered){
                  if(element.master_product_attribute && checker.master_product_attribute){
                    if(element.master_product_attribute.id == checker.master_product_attribute.id){
                      tempArray.attribute_value.push(checker.attribute_value);
                      checker.dataEntered = true;
                    }
                  }
                }
              });
              ! this.product.variant_attribute ?  this.product.variant_attribute = []:void(0);
              tempArray ?  this.product.variant_attribute.push(tempArray) : void(0);
            });
          }
          if( this.product.variant_attribute && this.product.variant_attribute){
            this.att =   this.product.variant_attribute.concat(this.product.variant_attribute);
          }else if(this.product.variant_attribute){
            this.att =  this.product.variant_attribute;
          }else if( this.product.variant_attribute){
            this.att =   this.product.variant_attribute;
          }
    })
  }

  /*--------------- slider images display when click on it ------------*/
  
  productDisplay(img, defaultImage){
    this.connectLoader = true;
    this.youtubeUrlStatus = false;
    if(img){
      this.featuredImage = img.product_variant_image_500x500;
      this.featuredFullImage = img.product_variant_image;
      this.connectLoader = false;
    }
  }

  productYoutubeDisplay(youtube_url){
    this.connectLoader = true;
    if(youtube_url){
      this.youtubeUrlStatus = true;
      this.youtubeUrl = youtube_url;
      this.connectLoader = false;
    }else{
      this.connectLoader = false;
    }
  }

 /*------------- select an option event for select product variant ------------*/

  changeFunc(e){
    this.vid = JSON.parse(e.value);
    this.changeSelected();
    this.router.navigate(['/categories/' + this.id + '/' + this.pid + '/' + JSON.parse(e.value)])
  }

  onClickPreferredProductList(id, pid, vid){
    this.allProductDetails(id, pid, vid);
    this.categoriesPreferredList();
    window.scrollTo(0,0);
  }

  changeSelected(){
        this.product.isSelected = true;
        this.variant_name =  this.product.variant_name;
        this.youtubeUrl =  this.product.youtube_link;
        this.minimum_order_quantity =  this.product.minimum_order_quantity;
        this.live_stock_dishpatch_time =  this.product.live_stock_dishpatch_time;
        this.minimum_quantity_of_reserve_stock =  this.product.minimum_quantity_of_reserve_stock;
        this.reserve_stocks2 =  this.product.reserve_stock;
        this.reserve_stock_dishpatch_time =  this.product.reserve_stock_dishpatch_time;
        this.available_qty =  this.product.quantity;
        this.selected = JSON.stringify( this.product.id);
        if(this.product.product_images.length>0){
          let results =  this.product.product_images.filter((x,k) => {
            if(x.is_feature === "yes"){
              return x.is_feature && x.product_variant_image_150x150;
            }
          }); 
          /*let result2 =  this.product.product_images.filter((x,k) => {
            if(x.is_feature === "no"){
              return x.is_feature && x.product_variant_image_150x150;
            }
          });*/

          if(results.length>0){
            this.featuredImage = results[0].product_variant_image_500x500;
            this.featuredFullImage = results[0].product_variant_image;
          }else{
            //this.featuredImage = result2[0].product_variant_image_500x500;
            //this.featuredFullImage = result2[0].product_variant_image;
            this.featuredImage = this.product[0].product_variant_image_500x500;
            this.featuredFullImage = this.product[0].product_variant_image;
          }
        }else{
          let result3 = this.default_image;
          this.featuredImage = result3;
          this.featuredFullImage = result3;
        }
    }

  /*------------------ add to cart functionality --------------*/
  
  addToCart(){
    if(this.quantity < this.minimum_order_quantity){
      this.toasterService.Error("Quantity should not be less than of minimum order quantity.");
    }else if(this.minimum_order_quantity === 0){
      this.toasterService.Error("Minimum order quantity is 0"); 
    }else if(this.quantity > this.available_qty && this.quantity <= this.reserve_stocks2){
      let confirmation_msg;
      if(this.reserve_stock_dishpatch_time == 0 && this.minimum_quantity_of_reserve_stock == 0){
        confirmation_msg = 'You are trying to order more than the Ready Stock. The new Dispatch Time and Minimum Order Quantity is not available at this moment';
      }

      if(this.reserve_stock_dishpatch_time == 0 && this.minimum_quantity_of_reserve_stock > 0){
        confirmation_msg = 'You are trying to order more than the Ready Stock. The new Dispatch Time is not available at this moment and Minimum Order Quantity '+this.minimum_quantity_of_reserve_stock+' Units will be applicable.';
      }

      if(this.reserve_stock_dishpatch_time > 0 && this.minimum_quantity_of_reserve_stock == 0){
        confirmation_msg = 'You are trying to order more than the Ready Stock. The new Dispatch Time '+this.reserve_stock_dishpatch_time+' Days and Minimum Order Quantity is not available at this moment.';
      }

      if(this.reserve_stock_dishpatch_time > 0 && this.minimum_quantity_of_reserve_stock > 0){
        confirmation_msg = 'You are trying to order more than the Ready Stock. The new Dispatch Time '+this.reserve_stock_dishpatch_time+' Days and Minimum Order Quantity '+this.minimum_quantity_of_reserve_stock+' Units will be applicable.';
      }

      this.confirmationDialogHandlerService.openDialog({
        question: confirmation_msg,
        confirmText: 'Accept',
        cancelText: 'Disagree'
      }).subscribe((result) => {
        if(result){
          if(this.quantity>=this.minimum_quantity_of_reserve_stock){
              this.cartType = 'add_cart';
              this.is_sample = 'no';
              this.addToCartCommonFunction();
          }else{
            this.toasterService.Error("Quantity should not be less than of minimum order quantity of reserve stock.");
          }
        }
      });    
    }else if(this.quantity > this.available_qty){
      if(this.quantity > this.reserve_stocks2){
        this.confirmationDialogHandlerService.openDialog({
          question: "You have exceed limit of available quantity in Ready Stock and Made to Order Stock",
          confirmText: 'Ok',
          cancelText: 'Cancel'
        }).subscribe((result) => {
          if(result){
            
          }
        }); 
      } 
    }else{
      this.cartType = 'add_cart';
      this.is_sample = 'no';
      this.addToCartCommonFunction();
    }
  }

  addToCartCommonFunction(){
    let variantToAdd = [];
    if(JSON.parse(localStorage.getItem('pendingOrderAmount'))){
      localStorage.removeItem('pendingOrderAmount');
      localStorage.removeItem('paid_amount');
      localStorage.removeItem('pending_amount');
    }
    if(this.cartData && this.cartData.length>0){
          let flag = false;
          this.cartData.forEach((data,index) => {
            if(this.product.id == data.id && data.user_id == this.userData.id){
              flag = true;
              this.cartData[index] = {
                product_name: this.product.product_name,
                variant_name: this.product.variant_name,
                variant_image: this.getFeatureImg(this.product.product_images),
                id: this.product.id,
                quantity: this.quantity,
                available_quantity: this.available_qty,
                reserve_stock_quantity: this.reserve_stocks2,
                minimum_order_quantity: this.minimum_order_quantity,
                minimum_quantity_of_reserve_stock: this.minimum_quantity_of_reserve_stock,
                sale_price: this.product.base_price,
                hsn_code: this.product.hsn_code,
                gst: this.product.gst,
                cart_type: this.cartType,
                is_sample: this.is_sample,
                cid:  this.id,
                pid: this.pid,
                vid: this.vid,
                user_id: this.userData.id,
                item_sku: this.product.sku_code,
                product_status: 'added',
                is_branding: 'no',
                destinationPin: "",
                MRP: this.product.max_retail_price,
                display_dimension_with_packing: this.product.display_dimension_with_packing,
                weight_with_packing: this.product.weight_with_packing,
              };
            }
          });  
        if(!flag){
          this.cartData.push({
            product_name: this.product.product_name,
            variant_name: this.product.variant_name,
            variant_image: this.getFeatureImg(this.product.product_images),
            id: this.product.id,
            quantity: this.quantity,
            available_quantity: this.available_qty,
            reserve_stock_quantity: this.reserve_stocks2,
            minimum_order_quantity: this.minimum_order_quantity,
            minimum_quantity_of_reserve_stock: this.minimum_quantity_of_reserve_stock,
            sale_price: this.product.base_price,
            gst: this.product.gst,
            is_sample: this.is_sample,
            cart_type: this.cartType,
            cid:  this.id,
            pid: this.pid,
            vid: this.vid,
            user_id: this.userData.id,
            item_sku: this.product.sku_code,
            product_status: 'added',
            is_branding: 'no',
            destinationPin: "",
            hsn_code: this.product.hsn_code,
            MRP: this.product.max_retail_price,
            display_dimension_with_packing: this.product.display_dimension_with_packing,
            weight_with_packing: this.product.weight_with_packing,
          });
        } 
      localStorage.setItem('cartData',JSON.stringify(this.cartData));
    }else{
          variantToAdd.push({
            product_name: this.product.product_name,
            variant_name: this.product.variant_name,
            variant_image: this.getFeatureImg(this.product.product_images),
            id: this.product.id,
            quantity: this.quantity,
            available_quantity: this.available_qty,
            reserve_stock_quantity: this.reserve_stocks2,
            minimum_order_quantity: this.minimum_order_quantity,
            minimum_quantity_of_reserve_stock: this.minimum_quantity_of_reserve_stock,
            sale_price: this.product.base_price,
            gst: this.product.gst,
            cart_type: this.cartType,
            is_sample: this.is_sample,
            cid:  this.id,
            pid: this.pid,
            vid: this.vid,
            user_id: this.userData.id,
            item_sku: this.product.sku_code,
            product_status: 'added',
            is_branding: 'no',
            hsn_code: this.product.hsn_code,
            destinationPin: "",
            MRP: this.product.max_retail_price,
            display_dimension_with_packing: this.product.display_dimension_with_packing,
            weight_with_packing: this.product.weight_with_packing,
          });
         localStorage.setItem('cartData',JSON.stringify(variantToAdd));
    }
    if(this.product.branding_possibilities == 'yes'){
      this.router.navigate(['/branding-selection/'+this.id+'/'+this.pid+'/'+this.vid]);
    }else{
      this.router.navigate(['/cart']); 
    }
  }  

  getSample(){
    if(!this.quantity){
      this.toasterService.Error("Quantity should not be empty.");
    }else if(this.quantity > 2){
      this.toasterService.Error("Quantity should be less than or equal to two.");
    }else{
      this.cartType = 'get_sample';
      this.is_sample = 'yes';
      this.addToCartCommonFunction();
    }
  }

  getFeatureImg(imgList){
    let imgUrl = '';
    if(imgList.length>0){
      let results = imgList.filter((x,k) => {
        if(x.is_feature === "yes"){
          return x.is_feature && x.product_variant_image_150x150;
        }
      }); 
      /*let result2 = imgList.filter((x,k) => {
        if(x.is_feature === "no"){
          return x.is_feature && x.product_variant_image_150x150;
        }
      });*/

      if(results.length>0){
        imgUrl = results[0].product_variant_image_500x500;
      }else{
        //imgUrl = result2[0].product_variant_image_500x500;
        imgUrl = imgList[0].product_variant_image_500x500;
      }
    }else{
      let result3 = this.default_image;
      imgUrl = result3;
    }
    return imgUrl;
  }

  categoriesPreferredList(){
    const preferred = {
      category_id : 1
    }
    let offset = 0;
    let limit = 10;
    this.user.categoriesPrefered(preferred,offset,limit).subscribe(preferedProductList=>{
      let response : any = preferedProductList
      let data = []
      data = response.data.rows;
      for(var i=0;i<data.length;i++){
          for(var j=0;j<data[i]['product_variants'].length;j++){
            this.tempProductListArr.push({ids: data[i]['id'],product_name: data[i]['product_name'],product_variants: data[i]['product_variants'][j]})
          }
      }
    this.totalArrayLimit = this.tempProductListArr.length;

    for(var k=0;k<this.arrayLimit;k++){
      if(this.tempProductListArr[k]){
        this.preferedProductList.push(this.tempProductListArr[k]);
      }
    }
     this.currentLimit = this.preferedProductList.length;
    })
  }

  modelChanged(val){
    if(val === null){
      this.quantity_status = false;
      //this.toasterService.Error('Please enter quantity');
    }else if(val > 0){
      this.quantity_status = true;
    }else{
      this.quantity_status = false;
      this.toasterService.Error('Please enter valid quantity');
    }  
  }

  close() {
    this.dialogRef.close();
  }

  openLiveStock(data) {
    this.matDialog.open(LiveStockComponent, {
      data: data,
      panelClass:'cstm_dialog_panel'
    });
    this.getLiveStock(data);
  }

  openReserveStock(data, sku_code) {
    this.matDialog.open(ReserveStockComponent, {
      data: this.reserve_stocks2+'='+this.reserve_stock_dishpatch_time+'='+sku_code+'='+this.live_stock_dishpatch_time+'='+this.minimum_quantity_of_reserve_stock+'='+this.minimum_order_quantity,
      panelClass:'cstm_dialog_panel2',
    });
    this.getLiveStock(sku_code);
  }

  getLiveStock(sku){
    this.user.getLiveStock(sku).subscribe(livestock=>{
      let response : any = livestock;
      if(response.data){
        this.live_stock_qty = response.data[sku].quantity;
        this.available_qty = response.data[sku].quantity;
        //this.available_qty = response.data[sku].quantity + this.product.reserve_stock;
      }else{
        this.toasterService.Warning(response.message);
      }
    });
  }

}
