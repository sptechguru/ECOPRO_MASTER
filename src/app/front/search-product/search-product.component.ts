import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { API } from 'app/shared/constants/endpoints';
import { SortByPipe } from 'app/shared/pipes/product-list-sort.pipe';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css'],
  providers: [SortByPipe]
})
export class SearchProductComponent implements OnInit {
  productId=[];
  productCheckedList=[];
  count=0;
  checkedAll=false;
  category_id: any;
  price: any;
  minPrice: any;
  maxPrice: any;
  stock: any;
  minStock: any;
  maxStock: any;

  offset: any;
  limit: any;
  loadType: any;
  filterScrollArray: any;
  preferedProductScrollListOne: Array<any> = [];
  preferedProductScrollList: Array<any> = [];
  pid: any;
  quantityFilterStatus: boolean = false;
  stockStatus: boolean;
  _isSearchAsTypeOn: boolean;
  term: string = '';
  connectLoader = true;
  filterList: boolean = false;
  search: any;
  tempProductListArr = [];
  preferedProductList= [];
  arrayLimit:any;
  currentLimit:any;
  totalArrayLimit:any;
  default_image: any;
  filterArray: any;
  showMoreData: boolean = false;
  notFound: any;
  isDesc: boolean = false;
  column: string = 'CategoryName';
  type: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  totalQueryableData: number = 0;
  pageSize: number = 10;
  page: number;
  offsets: any;
  sorting_type: any;
  isListLoading: boolean = false;
  recordsSortBy='hstock'
  previousQury:any={queryParams:{}};
  currentCategoryName="";
  constructor(private _route: ActivatedRoute, private user: UserService, 
    private toasterService: ToasterService, private router: Router) { }

  ngOnInit(): void {
    this.page = 1;
    
    this._route.queryParams.subscribe(params => {      
      if(params['category_id']){
        this.category_id = JSON.parse(params['category_id']);
        this.previousQury.queryParams.category_id=JSON.parse(params['category_id']);
      }
      if(params['price']){
        this.previousQury.queryParams.price=params['price'];
        this.price = params['price'].split("-");
        this.minPrice = this.price[0];
        this.maxPrice = this.price[1];
      }
      if(params['stock']){
        this.previousQury.queryParams.stock=params['stock'];
        this.stock = params['stock'].split("-");
        this.minStock = this.stock[0];
        this.maxStock = this.stock[1];
      }
    });
    
    this.filterArray = {
      "category_ids": this.category_id,
      "base_price": {
        "min": this.minPrice,
        "max": this.maxPrice
      },
      "stock": {
        "min": this.minStock,
        "max": this.maxStock
      }
    };
    this.getFilteredProductList('', this.filterArray, this.page);

    this.showMoreData= false
    this.arrayLimit = 10;
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
    this.type = 'low';
    this.categoriesList();
  }

  /*-------------------- common function for filter API calling -------------*/

  getFilteredProductList(loadType, filterArray, page,sort='hstock'){
    //this.offset = 0;
    //this.limit = 10;
    this.isListLoading = true;
    const limit = this.pageSize || 10;
    this.limit = limit;
    let data = {
      page: page
    }
    this.offset = (data.page - 1) * limit;
    this.connectLoader = true; 
    this.loadType = loadType;
    this.filterScrollArray = filterArray;
    this.user.getFilteredProduct(filterArray, this.search, this.offset, this.limit,sort).subscribe(categoryDetails=>{
    
      if(categoryDetails["success"] === true){
       
        if(categoryDetails["data"].rows.length>0){
          this.filterList = true;
          let response : any = categoryDetails;
          let data = [];

          data = response.data.rows;        
          this.preferedProductScrollList = data;
          this.totalQueryableData = categoryDetails["data"].total;
          this.currentCategoryName=categoryDetails["data"].product_category;
           this.filterVariantImage(data, categoryDetails["data"].total);
          this.connectLoader = false; 
        }else{
          this.isListLoading = false;
          this.connectLoader = false;
          this.notFound =  'blank';
          //this.toasterService.Warning("No record found");
        }
      }
    });
  }
  categoriesList() {
    console.log(this.category_id);
    this.connectLoader = true
    let fun = this.user.categoriesList();
    fun.subscribe(categoryList => {
      let response: any = categoryList
      let data = {};
      data = response.data;
      console.log(data);
      
      // if(this.category_id.length > 0){
      //   for(let i of response.data.rows){
      //     if(this.category_id.includes(i.id)){
      //       this.currentCategoryName+=i.product_category+',';
      //     }
          
      //   }
      //   this.currentCategoryName=this.currentCategoryName.slice(0,this.currentCategoryName.length-1);
      //     //console.log(this.currentCategoryName);
      // }
      
      
      
    })
  }

  handlePageChange(newPage) {
    if (newPage) {
      const limit = this.pageSize || 10;
      this.limit = limit;
      let data = {
        page: newPage
      }
      this.page = newPage;
      this.type = this.type;
      this.sort('base_price', this.type);
      this.offset = (data.page - 1) * limit;
      this.isListLoading = true;
      this.user.getFilteredProduct(this.filterScrollArray, this.search, this.offset, this.limit)
      .subscribe(categoryDetails=>{
        if(categoryDetails["success"] === true){
          if(categoryDetails["data"].rows.length>0){
            /*for (let j = 0; j < categoryDetails["data"].rows.length; j++) {
              this.preferedProductScrollList['push'](categoryDetails["data"].rows[j]);
            }*/
            //this.filterVariantImage(this.preferedProductScrollList, categoryDetails["data"].total); 
            this.filterVariantImage(categoryDetails["data"].rows, categoryDetails["data"].total); 
          }
        }   
      });
    }
  }

  onScrollDown(){
    /*this.offset += this.limit;
    this.user.getFilteredProduct(this.filterScrollArray, this.search, this.offset, this.limit)
    .subscribe(categoryDetails=>{
      if(categoryDetails["success"] === true){
        if(categoryDetails["data"].rows.length>0){
          for (let j = 0; j < categoryDetails["data"].rows.length; j++) {
            this.preferedProductScrollList['push'](categoryDetails["data"].rows[j]);
          }
          this.filterVariantImage(this.preferedProductScrollList, categoryDetails["data"].total); 
        }
      }   
    });*/
  }

  /*------------- function for filter products variant image condition --------------*/ 

  filterVariantImage(productData, total:any){
    this.tempProductListArr = [];
    this.preferedProductList = [];
    console.log(productData)
    productData.forEach((product:any)=>{
      console.warn(productData);
      
      if(product){ 
      // product.forEach((variant)=>{ 
        if(product.product_images.length>0){
          let results = product.product_images.filter((x,k) => {
            if(x.is_feature === "yes"){
              return x.is_feature && x.product_variant_image_150x150;
            }
          }); 
         
          if(results.length>0){
            this.tempProductListArr.push({ids: product.master_product.id,product_name: product.product_name,
              product_variants: product, featured_image: results[0].product_variant_image_150x150, 
              is_feature: results[0].is_feature, category_id: this.category_id,
              id: product.id
            }) 
          }else{
            if(product.product_images[0].product_variant_image_150x150){
              this.tempProductListArr.push({ids: product.master_product.id,product_name: product.product_name,
                product_variants: product, featured_image: product.product_images[0].product_variant_image_500x500, 
                is_feature: 'no', category_id: this.category_id, id: product.id})
            }else{
              this.tempProductListArr.push({ids: product.master_product.id,product_name: product.product_name,
                product_variants: product, featured_image: this.default_image, 
                is_feature: 'no', category_id: this.category_id, id: product.id})
            } 
            
          }
        }else{
          let result3 = this.default_image;
          this.tempProductListArr.push({ids: product.master_product.id,product_name: product.product_name,
            product_variants: product, featured_image: result3, 
            is_feature: 'no', category_id: this.category_id, id: product.id}) 
        }
     // }); 
     }else{
       this.toasterService.Warning("Product variant not found");
     } 
    }); 
      //this.totalArrayLimit = this.tempProductListArr.length;
      this.totalArrayLimit = total;
      this.preferedProductList = this.tempProductListArr;
      this.preferedProductList.map((x:any)=>{
        this.productId.push(x.id);
      })
      let ar=[];
    for(let i of this.preferedProductList){
      if(i.product_variants.default=='yes'){
        ar.push(i);
      }
    }
    this.preferedProductList=ar;
      this.isListLoading = false;
      this.currentLimit = this.preferedProductList.length;
      //this.sort('base_price', this.type);
  }

  

  sortBySelectionChange(event) {
    this.getFilteredProductList('', this.filterArray, this.page,event.value);
    /*switch (event.value) {
      case 'hl':
        this.sort('base_price', 'high');
        break;
      case 'lh':
        this.sort('base_price', 'low');
        break;
      case 'rf':
        this.sort('created_at', 'high');
        break;
    }
    */
  }

  sort(property, type = 'low') {
    this.type = type;
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    let direction = this.isDesc ? 1 : -1;
    direction = type === 'low' ? 1 : -1;

    if(property === 'created_at') {
      this.preferedProductList.sort(function (a, b) {
        let a_time =  new Date(a.product_variants[property]);
        let b_time =  new Date(b.product_variants[property]);
        if (a_time < b_time) {
          return -1 * direction;
        }
        else if (a_time > b_time) {
          return 1 * direction;
        }
        else {
          return 0;
        }
      });
    } else {
      this.preferedProductList.sort(function (a, b) {
        if (a.product_variants[property] < b.product_variants[property]) {
          return -1 * direction;
        }
        else if (a.product_variants[property] > b.product_variants[property]) {
          return 1 * direction;
        }
        else {
          return 0;
        }
      });
    }
  };

  
  productDetailDealsRoute(c_id, product_id, variant_id){
    this.router.navigate(['categories', c_id, product_id, variant_id]);
  }

  
  setAllCheckbox(event){
    this.checkedAll=!this.checkedAll;
    console.log(event.checked);
    if(event.checked){
      this.productCheckedList=this.productId;
      this.count=this.productId.length;
    }
    else{
      this.count=0;
      this.productCheckedList=[];
    }
    console.log(this.productCheckedList);
   }

   setSingleCheckbox(event,value){
    console.log(event.checked);
    if(event.checked){
      this.productCheckedList.push(value);
      this.count++;
    }else{
       let index=this.productCheckedList.indexOf(value);
       console.log(index);
       this.productCheckedList.splice(index,1);
       this.count--;
      }
      console.log(this.productCheckedList);
   }

   AddCatalogue(){
     sessionStorage.setItem('filterurl','/filtered-products');
     sessionStorage.setItem('filterparam',JSON.stringify(this.previousQury));
     sessionStorage.setItem('catalogue',JSON.stringify(this.productCheckedList));
     this.router.navigate(['/add-catalogue']);
   }

}
