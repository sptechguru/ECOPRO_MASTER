import { Component, Input, OnInit, Injectable  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { Options, LabelType } from 'ng5-slider';
import { SortByPipe } from 'app/shared/pipes/product-list-sort.pipe';

@Injectable()
export class ChecklistDatabase {
  constructor(private _route: ActivatedRoute, private user: UserService) {
  
  }
}

@Component({
  selector: 'app-catalogue-multiple-products',
  templateUrl: './catalogue-multiple-products.component.html',
  styleUrls: ['./catalogue-multiple-products.component.css'],
  providers: [ChecklistDatabase, SortByPipe]
})
export class CatalogueMultipleProductsComponent implements OnInit {
  categoryList = []
  showMoreCategory :any;
  nextPage:any;
  tempArray:any;
  arrayLimit:any;
  currentLimit:any;
  totalArrayLimit:any;
  items = []
  productDetails = [];
  treeDropDownArr = [];
  productChildDetails = [];
  preferedProductList= []
  tempProductListArr = [];
  filterProductList= [];
  variant_list:any=[];
  varientArr:any;
  currentPage: number;
  totalPages: number;
  showMoreData: boolean = false
  connectLoader = true;
  categoryID: Array<any> = [];
  default_image: any;
  filterList: boolean = false;
  paramId: any;
  filterProductByCategory= [];
  filterRangeData: any;
  minPrice: any;
  maxPrice: any;
  productDataByRange: any;
  filterStatus: boolean = false;
  priceFilterStatus: boolean = false;
  filterArray: any;
  search: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  offset: any;
  limit: any;
  loadType: any;
  filterScrollArray: any;
  preferedProductScrollList: Array<any> = [];
  categoryDetails: any;
  
  constructor(private _route : ActivatedRoute, private _api : ApiHandlerService, private fb: FormBuilder ,
    public translate: TranslateService,
    public localStorage: StorageAccessorService,
    private toasterService: ToasterService,
    private router: Router,
    private user: UserService,
    private _database: ChecklistDatabase
    ) {}
    
  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.paramId = '43';
    this._route.queryParams.subscribe(params => {
      this.search = params['search'];
    });
    if(this.paramId){
      let filterArray = {
          "category_ids": this.paramId,
          "base_price": {}
      };
      this.getFilteredProductList('onload', filterArray);
    }else{
      this.categoriesPreferredList();
      this.categoriesFilterList();
      this.allProductDetails();
    }
    this.showMoreData= false
    this.arrayLimit = 10;
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
    window.addEventListener('scroll',this.scrollCategory,true);
  }

  /*----------------------- preferd products list ---------------------*/

  categoriesPreferredList(){
    this.tempProductListArr = [];
    this.preferedProductList = [];
    const preferred = {
      category_id : 1
    }
    this.connectLoader = true;
    let page = 0;
    let limit = 10;
    this.user.categoriesPrefered(preferred, page, limit).subscribe(preferedProductList=>{
      let response : any = preferedProductList
      let data = [];
      data = response.data.rows;
      data.forEach((product, i)=>{ 
        product.product_variants.forEach((variant, j)=>{ 
          if(variant.product_images.length>0){
            let results = variant.product_images.filter((x,k) => {
              if(x.is_feature === "yes"){
                return x.is_feature && x.product_variant_image_150x150;
              }
            }); 
           

            if(results.length>0){
              this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
                product_variants: variant, featured_image: results[0].product_variant_image_150x150, 
                is_feature: results[0].is_feature, category_id: product.master_product_category_id,
                id: variant.id
              }) 
            }else{
              if(variant.product_images[0].product_variant_image_150x150){
                this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
                product_variants: variant, featured_image: variant.product_images[0].product_variant_image_150x150, 
                is_feature: 'no', category_id: product.master_product_category_id, id: variant.id})
                 
              }else{
                this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
                  product_variants: variant, featured_image: this.default_image, 
                  is_feature: 'no', category_id: product.master_product_category_id, id: variant.id})
              }
            }
          }else{
            let result3 = this.default_image;
            this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
              product_variants: variant, featured_image: result3, 
              is_feature: 'no', category_id: product.master_product_category_id, id: variant.id}) 
          }
        });  
      }); 
      this.totalArrayLimit = this.tempProductListArr.length;
      for(var k=0;k<this.arrayLimit;k++){
          if(this.tempProductListArr[k]){
            this.preferedProductList.push(this.tempProductListArr[k]);
          }
      }
     this.currentLimit = this.preferedProductList.length;
     this.connectLoader = false 
    })
  }

  showMoreCategoriesList(){
      if(this.totalArrayLimit!=this.currentLimit){
        this.arrayLimit += 10;
      for(var i=this.currentLimit;i<this.arrayLimit;i++){
        if(this.tempProductListArr[i] != undefined){
          this.preferedProductList.push(this.tempProductListArr[i])
        }
      }
      this.currentLimit = this.preferedProductList.length;
      }
  }

  scrollCategory = (event)=> {
    if(this.totalArrayLimit>=this.currentLimit){
      this.showMoreCategoriesList();
    }
  }

  categoriesFilterList(){
    const filter = {
      "category_ids": [
      ],
      "base_price": {
      }
    }
    this.user.categoriesFilter(filter).subscribe(filterProductList=>{
      
     let response : any = filterProductList
     let data = []
      data = response.data
      this.filterProductList = data['rows'][0]['product_variants'];
    })
  }

  allProductDetails(){
    const id = this._route.snapshot.paramMap.get('id');
    if(id){
      this.user.getProductCategoryDetails(id).subscribe(productDetails=>{
        let response : any = productDetails
        let data = []
        data = response.data
        this.productDetails = data;
       })
    }
  }


  /*----------------------------- filtered product list --------------------------------*/

  minValue: number = 50;
  maxValue: number = 50000;
  options: Options = {
    floor: 50,
    ceil: 50000,
    step: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min price: </b>" + value;
        case LabelType.High:
          return "<b>Max price: </b>" + value;
        default:
         // return "" + value;
      }
    }
  };

  priceFilterCheckbox(e){
    if(e.target.checked){
      this.priceFilterStatus =  true;
    }else{
      this.priceFilterStatus =  false;
    }
    if(e.target.checked && !this.minPrice && !this.maxPrice && this.categoryID.length === 0){
      this.filterArray = {
        "category_ids": this.paramId,
        "base_price": {
          "min": 50,
          "max": 50000
        }
      };
    }else if(e.target.checked && !this.minPrice && !this.maxPrice && this.categoryID.length > 0){
      this.filterArray = {
        "category_ids": this.categoryID,
        "base_price": {
          "min": 50,
          "max": 50000
        }
      };
    }else if(e.target.checked && this.minPrice && this.maxPrice && this.categoryID.length === 0){
      this.filterArray = {
        "category_ids": this.paramId,
        "base_price": {
          "min": this.minPrice,
          "max": this.maxPrice
        }
      };
    }else if(e.target.checked && this.minPrice && this.maxPrice && this.categoryID.length > 0){
      this.filterArray = {
        "category_ids": this.categoryID,
        "base_price": {
          "min": this.minPrice,
          "max": this.maxPrice
        }
      };
    }else if(!e.target.checked && this.categoryID.length > 0){
      this.filterArray = {
        "category_ids": this.categoryID,
        "base_price": {}
      };
    }else if(!e.target.checked && this.categoryID.length === 0){
      this.filterArray = {
        "category_ids": this.paramId,
        "base_price": {}
      };
    } 
    this.totalArrayLimit = []; 
    this.getFilteredProductList('filter', this.filterArray);
  }

  filterProductByPrice(e){
    this.minPrice = e.value;
    this.maxPrice = e.highValue;
    if(this.categoryID.length>0){
      this.filterArray = {
        "category_ids": this.categoryID,
        "base_price": {
          "min": this.minPrice,
          "max": this.maxPrice
        }
      };
    }else if(this.categoryID.length === 0){
      this.filterArray = {
        "category_ids": this.paramId,
        "base_price": {
          "min": this.minPrice,
          "max": this.maxPrice
        }
      };
    }
    if(this.priceFilterStatus){
      this.totalArrayLimit = []; 
      this.getFilteredProductList('filter', this.filterArray); 
    }else{
      this.toasterService.Warning("Please select checkbox");
    }
  }

  getFilterProductByCategory(val, e){
    this.connectLoader = true; 
    if(e.checked){
      this.categoryID.push(val.id);  
    }else{
      var whatIndex = null;
      this.categoryID.forEach(function(value, index){
        if(value === val.id){
          whatIndex = index;
        }
      });
      this.categoryID.splice(whatIndex, 1);
    }
    if(this.categoryID.length>0){
      if(this.priceFilterStatus && this.minPrice && this.maxPrice){
        this.filterArray = {
          "category_ids": this.categoryID,
          "base_price": {
            "min": this.minPrice,
            "max": this.maxPrice
          }
        }; 
      }else if(this.priceFilterStatus && !this.minPrice && !this.maxPrice){
        this.filterArray = {
          "category_ids": this.categoryID,
          "base_price": {
            "min": 50,
            "max": 50000
          }
        }; 
      }else if(!this.priceFilterStatus){
        this.filterArray = {
          "category_ids": this.categoryID,
          "base_price": {}
        }; 
      }  
    }else{
      if(this.priceFilterStatus && !this.minPrice && !this.maxPrice){
        this.filterArray = {
          "category_ids": this.paramId,
          "base_price": {
            "min": 50,
            "max": 50000
          }
        };   
      }else if(this.priceFilterStatus && this.minPrice && this.maxPrice){
        this.filterArray = {
          "category_ids": this.paramId,
          "base_price": {
            "min": this.minPrice,
            "max": this.maxPrice
          }
        };  
      }else if(!this.priceFilterStatus){
        this.filterArray = {
          "category_ids": this.paramId,
          "base_price": {}
        };  
      }
    }
    this.totalArrayLimit = []; 
    this.getFilteredProductList('filter', this.filterArray); 
  }

  /*-------------------- common function for filter API calling -------------*/

  getFilteredProductList(loadType, filterArray){
    this.offset = 0;
    this.limit = 10;
    this.connectLoader = true; 
    this.loadType = loadType;
    this.filterScrollArray = filterArray;
    this.user.getFilteredProduct(filterArray, this.search, this.offset, this.limit).subscribe(categoryDetails=>{
      if(categoryDetails["success"] === true){
        if(categoryDetails["data"].rows.length>0){
          this.filterList = true;
          let response : any = categoryDetails;
          let data = [];
          data = response.data.rows;
          this.preferedProductScrollList = data;
          this.filterVariantImage(data, categoryDetails["data"].total);
          this.connectLoader = false; 
        }else{
          this.connectLoader = false;
          this.tempProductListArr = [];
          this.preferedProductList = [];
          if(loadType === 'onload'){
            this.filterStatus = true;
          }else{
            this.filterStatus = false;
          }
          this.toasterService.Warning("No record found");
        }
      }
    });
  }

  onScrollDown() {
    this.offset += this.limit;
    this.user.getFilteredProduct(this.filterScrollArray, this.search, this.offset, this.limit).subscribe(categoryDetails=>{
      for (let j = 0; j < categoryDetails["data"].rows.length; j++) {
        this.preferedProductScrollList['push'](categoryDetails["data"].rows[j]);
      }
      this.filterVariantImage(this.preferedProductScrollList, categoryDetails["data"].total); 
    });
  }

  /*------------- function for filter products variant image condition --------------*/ 

  filterVariantImage(productData, total){
    this.tempProductListArr = [];
    this.preferedProductList = [];
    productData.forEach((product, i)=>{ 
      product.product_variants.forEach((variant, j)=>{ 
        if(variant.product_images.length>0){
          let results = variant.product_images.filter((x,k) => {
            if(x.is_feature === "yes"){
              return x.is_feature && x.product_variant_image_150x150;
            }
          }); 
          
          if(results.length>0){
            this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
              product_variants: variant, featured_image: results[0].product_variant_image_150x150, 
              is_feature: results[0].is_feature,  id: variant.id}) 
          }else{
            if(variant.product_images[0].product_variant_image_150x150){
              this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
                product_variants: variant, featured_image: variant.product_images[0].product_variant_image_150x150, 
                is_feature: 'no',  id: variant.id})
            }else{
              this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
                product_variants: variant, featured_image: this.default_image, 
                is_feature: 'no', id: variant.id})
            }
            
           
          }
        }else{
          let result3 = this.default_image;
          this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
            product_variants: variant, featured_image: result3, 
            is_feature: 'no', id: variant.id}) 
        }
      });  
    }); 
       this.totalArrayLimit = total;
      //this.totalArrayLimit = this.tempProductListArr.length;
      for(var k=0;k<this.arrayLimit;k++){
          if(this.tempProductListArr[k]){
            this.preferedProductList.push(this.tempProductListArr[k]);
          }
      }
    this.currentLimit = this.preferedProductList.length;
  }


 /*----------------------------- Add product into catalogue list --------------------------------*/

  
 getCheckboxValues(event,item,key){
  if(event.checked == true){
    this.variant_list.push(item.product_variants.id);
  }else {
    var removeId = this.variant_list.indexOf(item.product_variants.id);
    this.variant_list.splice(removeId , 1);
  }
 }

addproductCatalogue(){
  var catalogue_id = this._route.snapshot.paramMap.get('catalogue_id');
  var body = {
    variant_list: this.variant_list
  }
  if(this.variant_list.length>0){
    this.user.addProductCatalogue(catalogue_id, body).subscribe(addProductRes =>{
      if(addProductRes && addProductRes['message']){
        this.router.navigate(['/catalogue']);
        this.toasterService.Success('Product added into catalogue successfully');
      }
    })
  }else{
    this.toasterService.Warning('Please select at least one product');
  }
}

}
