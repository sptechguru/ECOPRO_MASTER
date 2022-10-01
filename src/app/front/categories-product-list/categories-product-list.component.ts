import { KycdilogformComponent } from './../kycdilogform/kycdilogform.component';
import { KycComponent } from './../kyc/kyc.component';
import { CustomerdetailComponent } from './../customerdetail/customerdetail.component'

import {
  Component, Input, OnInit, Injectable, HostListener, ViewChild, AfterViewInit,
  ElementRef
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
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
import { Observable } from 'rxjs';
import { SortByPipe } from 'app/shared/pipes/product-list-sort.pipe';
import { MatDialog } from '@angular/material/dialog';
import { RoadBlockBannerComponent } from '../road-block-banner/road-block-banner.component';
import { filter, tap } from 'rxjs/operators';
declare var $:any;
export class TodoItemNode {
  child: TodoItemNode[];
  product_category: string;
  id: number;
}

export class TodoItemFlatNode {
  product_category: string;
  level: number;
  id: number;
  expandable: boolean;
}

const TREE_DATA = {};

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }
  search: any;
  paramId: any;
  master_product_category_id: any;
  id: any;
  pid: any;
  parent_category: any;
  userData: any;
  constructor(private _route: ActivatedRoute, private user: UserService,
    public localStorage: StorageAccessorService,) {
    this.paramId = this._route.snapshot.paramMap.get('id');
    this.pid = this._route.snapshot.paramMap.get('pid');
    this.userData = this.localStorage.fetchData();
    this._route.queryParams.subscribe(params => {
      this.search = params['search'];
      if (this.paramId && this.pid && this.pid != 0) {
        let filterArray = {
          "category_ids": [this.paramId, this.pid],
          "base_price": {}
        };
        this.getFilteredProductList('onload', filterArray);
      } else if (this.paramId && this.pid && this.pid == 0) {
        let filterArray = {
          "category_ids": [this.paramId],
          "base_price": {}
        };
        this.getFilteredProductList('onload', filterArray);
      } else if (this.paramId && !this.pid && !this.search) {
        this.initialize('', '', '');
      }
    });
  }

  getFilteredProductList(loadType, filterArray) {
    let fun;
    if (this.userData) {
      fun = this.user.getFilteredProduct(filterArray, this.search, 0, 50);
    } else {
      fun = this.user.getHomeFilteredProduct(filterArray, this.search, 0, 50);
    }
    fun.subscribe(categoryDetails => {     
      if (categoryDetails["success"] === true) {
        if (categoryDetails["data"].rows.length > 0) {
          let response: any = categoryDetails;
          let data = []
          data = response.data.rows;        
          if (this.search) {
            this.master_product_category_id = data[0].master_product_category.fk_master_product_category_id;
            this.id = data[0].master_product_category.id;
            this.parent_category = data[0].master_product_category.parent_category;
            this.initialize(this.master_product_category_id, this.id, this.parent_category);
          } else if (this.paramId && this.pid && !this.search) {
            this.master_product_category_id = data[0].master_product_category.fk_master_product_category_id;
            this.id = data[0].master_product_category.id;
            this.parent_category = data[0].master_product_category.parent_category;
            this.initialize(this.master_product_category_id, this.id, this.parent_category);
          }
        } else {
        }
      }
    });
  }

  initialize(master_id, pid, parent_category) {
    const id = this._route.snapshot.paramMap.get('id');   
    this._route.queryParams.subscribe(params => {
      this.search = params['search'];
    });
    if (master_id) {
      let fun;
      if (this.userData) {
         fun = this.user.getProductCategoryDetails(master_id);
      } else {
         fun = this.user.getHomeProductCategoryDetails(master_id);
      }
      fun.subscribe(productCategoryDetails => {
      
        if (productCategoryDetails["success"] === true) {         
          const TREE_DATA = productCategoryDetails["data"];        
          const data = this.buildFileTree(TREE_DATA, 0);
           
          this.dataChange.next(data);
          
        }
      });
    } else {
      let fun2;
      if (this.userData) {
        fun2 = this.user.getProductCategoryDetails(id);
      } else {
        fun2 = this.user.getHomeProductCategoryDetails(id);
      }
      fun2.subscribe(productCategoryDetails => {
       
        if (productCategoryDetails["success"] === true) {          
          const TREE_DATA = productCategoryDetails["data"];      
          const data = this.buildFileTree(TREE_DATA, 0);         
          this.dataChange.next(data);
         
        }
      });
    }
  }

  buildFileTree(value: any, level: number) {
    let data: any[] = [];
    data.push(value);
    return data;
  }
}

@Component({
  selector: 'app-categories-product-list',
  templateUrl: './categories-product-list.component.html',
  styleUrls: ['./categories-product-list.component.scss'],
  providers: [ChecklistDatabase, SortByPipe]
})
export class CategoriesProductListComponent implements  OnInit  {
  bannerConfig = {

    "nextArrow": "<div class='nav-btn next-slide'><span class='material-icons'>arrow_forward_ios</span> </div>",
    "prevArrow": "<div class='nav-btn prev-slide'><span class='material-icons'>arrow_back_ios_new</span></div>",
    "dots": false,
    "speed": 800,
    "autoplay": true,
    "autoplaySpeed": 2000,
    "infinite": true,
    "arrow": true,
  };
  categoryConfig = {

    "nextArrow": "<div class='nav-btn slide-btn-rounded next-slide'><span class='material-icons'>east</span> </div>",
    "prevArrow": "<div class='nav-btn slide-btn-rounded prev-slide'><span class='material-icons'>west</span></div>",
    "dots": false,
    "speed": 300,
    "infinite": false,
    "arrow": true,
    "slidesToShow": 8,
    "slidesToScroll": 1,
    "touchMove": true,
    "draggable": true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }

    ]
  };

  /*------------ slider_cms --------------------*/
  slider1Config = {

    "nextArrow": "<div class='nav-btn slide-btn-rounded next-slide'><span class='material-icons'>east</span> </div>",
    "prevArrow": "<div class='nav-btn slide-btn-rounded prev-slide'><span class='material-icons'>west</span></div>",
    "dots": false,
    "speed": 300,
    "infinite": false,
    "arrow": true,
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "touchMove": true,
    "draggable": true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }

    ]
  };

  productSlider = {

    "nextArrow": "<div class='nav-btn slide-btn-rounded next-slide'><span class='material-icons'>east</span> </div>",
    "prevArrow": "<div class='nav-btn slide-btn-rounded prev-slide'><span class='material-icons'>west</span></div>",
    "dots": false,
    "speed": 300,
    "infinite": false,
    "arrow": true,
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "touchMove": true,
    "draggable": true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }

    ]
  };
  productId=[];
  productCheckedList=[];
  count=0;
  checkedAll=false;
  categoryList = [];
  collectionList=[];
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
  preferedProductList = []
  tempProductListArr = [];
  filterProductList = [];
  varientArr: any;
  currentPage: number;
  totalPages: number;
  showMoreData: boolean = false
  connectLoader = true;
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;
  newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true);
  categoryID: Array<any> = [];
  default_image: any;
  filterList: boolean = false;
  paramId: any;
  filterProductByCategory = [];
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
  preferedProductScrollListOne: Array<any> = [];
  preferedProductScrollList: Array<any> = [];
  pid: any;
  stock: any;
  quantityFilterStatus: boolean = false;
  stockStatus: boolean;
  _isSearchAsTypeOn: boolean;
  term: string = '';
  categories: any;
  minPrices: any;
  maxPrices: any;
  categoryPreferedArray: Array<any> = [];
  pricePreferedArray: any;
  stockPreferedArray: any;
  sliderImages: any;
  dealsName: any;
  dealsProduct: any;
  imageBarImages: any;
  imageBarImages1: any;
  imageBarImages2: any;
  imageBarImages3: any;
  imageBarImages4: any;
  imageBarImages5: any;
  imageBarImages6: any;
  imageBarImages7: any;
  slidebar: any;
  slidebar1: any;
  slidebar2: any;
  slidebar3: any;
  slidebar4: any;
  slidebar5: any;
  price: any;
  items2: [];
  totalArrayLimit2: any;
  categoryList2 = [];
  currentLimit2: any;
  isDesc: boolean = false;
  column: string = 'CategoryName';
  type: any;
  totalQueryableData: number = 0;
  pageSize: number = 10;
  page: number;
  offsets: any;
  sorting_type: any;
  isListLoading: boolean = false;
  userData: any;
  sub_items = [];
  title: any;
  description: any;
  fileUpload: File = null;
  imgURL: any;
  isSingleUploaded = false;
  isCreateProcessing = false;
  recordsSortBy: string = 'hstock';
  popup=false;
  login_status=false;
  currentCategoryName;
  kycdata:any;
  gstno:any;
  gststatus:any;
  emailverify:any;
  validaccount:any;
  showcustomerdetails=false

  @ViewChild('searchInput') searchEl: ElementRef;
  previousQury:any={queryParams:{}};
 
  @Input()
  set isSearchAsTypeOn(val) {
    this._isSearchAsTypeOn = val;
  }

  ngAfterViewInit() {
    if (this.searchEl) {
      const keyUpEv = Observable.fromEvent(
        this.searchEl.nativeElement,
        'keyup'
      );
      const debouncedKeyupEv = keyUpEv.debounce(() => Observable.interval(1000));
      debouncedKeyupEv.subscribe({
        next: () => {
          this.term = this.searchEl.nativeElement.value;
          if (this.term != '') {
            this.trimSearchData('');
          }
        }
      });
    }
  }

  constructor(private _route: ActivatedRoute, private _api: ApiHandlerService, private fb: FormBuilder,
    public translate: TranslateService,
    public localStorage: StorageAccessorService,
    private toasterService: ToasterService,
    private router: Router,
    private user: UserService,
    private _database: ChecklistDatabase,
    public dailog: MatDialog,
  ) {
   
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  //  this._database.currentCategoryName.subscribe(data => {
  //     //this.dataSource.data = data;
  //     console.log("indb",data)
  //   });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;
  isExpandable = (node: TodoItemFlatNode) => node.expandable;
  getChildren = (node: TodoItemNode): TodoItemNode[] => node.child;
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.product_category === '';
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.id === node.id
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.product_category = node.product_category;
    flatNode.id = node.id;
    flatNode.level = level;
    flatNode.expandable = !!node.child?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  
  openDialogs() :any{ 
     this.userData=localStorage.getItem("UserData");
    
     console.log(this.emailverify)
    if(this.emailverify !="verified")
    {
      
      const dailog = this.dailog.open(KycComponent,{
        disableClose:true,
      });
      dailog.afterClosed().subscribe(result => {
        // console.log(`Dialog result: ${result}`);
      });

    }else
    {
      console.log("nooo")
      const dailog = this.dailog.open(KycdilogformComponent,{
        disableClose:true,
      });
      dailog.afterClosed().subscribe(result => {
      //  console.log(`Dialog result: ${result}`);
      });
  
    }
   
  
  }

  ngOnInit() { 
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // console.log('prev:', event.url);

      });
    
  //  this.userData = this.localStorage.fetchData();
      this.userData= localStorage.getItem('userData');
     
      if(this.userData != null)
      {
        let userdatas=JSON.parse( this.userData);
       // console.log(userdatas.data.email_verification)
        this.emailverify=userdatas.data.email_verification
        this.validaccount=userdatas.data.valid_account;
       

      }else
      {
        this.router.navigate(['/']);
      }
     // debugger
      if(this.validaccount == "no")
    {
      // this.showcustomerdetails=true;
      const dailog=this.dailog.open(CustomerdetailComponent,{
        disableClose:true,
        panelClass: 'customerdetails'
      });
      dailog.afterClosed().subscribe(rs=>{

      })
    } 
     
    this.kycdata=localStorage.getItem('kyc');
   // console.log(this.kycdata)
    if( this.kycdata !=null)
    {  
      let newkycdd=JSON.parse(this.kycdata);   
      this.gstno=newkycdd.gst_no;
      this.gststatus=newkycdd.gst_status;
    }
     
    if (this.userData) {
      this.getSliderImage();
      this.getDealsProduct();
      this.getImageBarFiles();
    }
    this.getCollection();
    this.categoriesList();
    // console.log(this.router.url);
    let bannertype = sessionStorage.getItem('banner');
    // console.log(bannertype);
    if (this.router.url.endsWith('prefered-products') && bannertype == 'true') {
     // this.openDialog();
      sessionStorage.setItem('banner', 'false');
    }
    this.page = 1;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.paramId = this._route.snapshot.paramMap.get('id');
    this.previousQury.queryParams={id:this.paramId}
    this.pid = this._route.snapshot.paramMap.get('pid');
    // console.log(this.paramId);
    // console.log(this.pid);
    this._route.queryParams.subscribe(params => {
      this.search = params['search'];
    });
    if (this.paramId && this.pid && this.pid != 0) {
     
      let filterArray = {
        "category_ids": [this.paramId, this.pid],
        "base_price": {}
      };
      this.getFilteredProductList('onload', filterArray, this.page);
    } else if (this.paramId && this.pid && this.pid == 0) {
     
      let filterArray = {
        "category_ids": [this.paramId],
        "base_price": {}
      };
      this.getFilteredProductList('onload', filterArray, this.page);
    } else if (this.paramId && !this.pid) {
    
      let filterArray = {
        "category_ids": [this.paramId],
        "base_price": {}
      };
      this.getFilteredProductList('onload', filterArray, this.page);
    } else if (!this.paramId && !this.pid && !this.search) {
      
      if (this.userData) {
        this.categoriesPreferredList();
        this.categoriesFilterList();
        this.allProductDetails();
      } else {
        //this.categoriesFilterList();
      }
    }
    this.showMoreData = false
    this.arrayLimit = 10;
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
    this.type = 'low';
    
    if(this.userData instanceof Object){
      this.login_status = true;
    }else{ 
      this.login_status = false;
    }
    
    // this.getKycDetails();
  }

  // getKycDetails(){
  //   this._api.apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS).pipe(
  //     tap({
  //       next:res=>{
  //         if(res.res){
  //           // console.log(res.data);
  //           if(res.res && res.data.business_kyc === 'yes'){
  //             this.localStorage.KycAndQuesCheck = {kyc : true}
  //             // this.DialogService.setKYC(data.data);
  //             if(JSON.parse(localStorage.getItem('billing'))){
  //               // this.router.navigate(['prefered-products']); 
  //             }else{
  //               // this.router.navigate(['kyc/kycform']);
  //             }
  //           } else{
  //             // this.DialogService.setKYC('');
  //             // this.router.navigate(['kyc/kycform']);
  //           } 
  //         } 
  //       },
  //       error:err=> {
  //         // this.DialogService.setKYC('');
  //         // this.router.navigate(['kyc/kycform']);
  //       }  
  //     })
  //   ).subscribe()
  // }

  getCollection(){
    this._api.apiGet(API.COLLECTION.COLLECTION_LIST+'?offset=0&limit=100').pipe().subscribe(
      {
        next:data=>{
          // console.log(data);
          if(data["success"] = true){
           this.collectionList=data.data.rows; 
          }
        },
        error: err => {},
        complete: () => {}
      }
    )
  }
 
  getSliderImage(){
    this._api.apiGet(API.SLIDER.SLIDER_FILES+'?device_type=web').pipe().subscribe(
      {
        next: data => {
          if (data["success"] = true) {
            this.sliderImages = data.data["rows"];
          }
        },
        error: err => { },
        complete: () => { }
      }
    )
  }

  getImageBarFiles() {
    this._api.apiGet(API.SLIDER.IMAGEBAR_FILES + '?content_type=--').pipe().subscribe(
      {
        next: data => {
          if (data["success"] = true) {
            this.imageBarImages = data.data["rows"];
            let slide_array = [];
            this.imageBarImages.forEach((value, index) => {
              if (value.device_type == 'web') {
                if (value.content_type == 'slidebar1') {
                  slide_array.push(value);
                }
                const content_type = value.content_type;
                switch (content_type) {
                  case 'imagebar1':
                    this.imageBarImages1 = value;
                    break;
                  case 'imagebar2':
                    this.imageBarImages2 = value;
                    break;
                  case 'imagebar3':
                    this.imageBarImages3 = value;
                    break;
                  case 'imagebar4':
                    this.imageBarImages4 = value;
                    break;
                  case 'imagebar5':
                    this.imageBarImages5 = value;
                    break;
                  case 'imagebar6':
                    this.imageBarImages6 = value;
                    break;

                  default:
                    break;
                }
              }
            });
            for (let i = 0; i < slide_array.length; i++) {
              if (i == 0) {
                this.slidebar1 = slide_array[i];
              } else if (i == 1) {
                this.slidebar2 = slide_array[i];
              } else if (i == 2) {
                this.slidebar3 = slide_array[i];
              } else if (i == 3) {
                this.slidebar4 = slide_array[i];
              } else if (i == 4) {
                this.slidebar5 = slide_array[i];
              }
            }

          }
        },
        error: err => { },
        complete: () => { }
      }
    )
  }

  getDealsProduct() {
    this._api.apiGet(API.DEALS.DEALS_PRODUCT).pipe().subscribe(
      {
        next: data => {
          if (data["success"] = true) {
            this.dealsProduct = data.data["rows"];
            this.dealsProduct.forEach((product, i) => {
              if (product.product_variants.length > 0) {
                product.product_variants.forEach((variant, j) => {
                  if (variant.product_images.length > 0) {
                    let results = variant.product_images.filter((x, k) => {
                      if (x.is_feature === "yes") {
                        return x.is_feature && x.product_variant_image_500x500;
                      }
                    });
                    if (results.length > 0) {
                      variant["image"] = results[0].product_variant_image_500x500;
                    } else {
                      if (variant.product_images[0].product_variant_image_500x500) {
                        variant["image"] = variant.product_images[0].product_variant_image_500x500;
                      } else {
                        variant["image"] = this.default_image;
                      }
                    }
                  } else {
                    let result3 = this.default_image;
                    variant["image"] = result3;
                  }
                });
              }
            });
          }
        },
        error: err => { },
        complete: () => { }
      }
    )
  }

  viewAll(deals_id) {
    this.router.navigate(['search-deals-product', deals_id]);
  }
  
  lookingFor(){
    this.router.navigate(['/search']);
  }

  productDetailDealsRoute(deals_id, product_id, variant_id) {
    this.router.navigate(['categories', deals_id, product_id, variant_id],
      { queryParams: { deals: true } })
  }

  categoriesList() {
    this.connectLoader = true
    let fun;
    if (this.userData) {
      fun = this.user.categoriesList();
    } else {
      fun = this.user.homeCategoriesList();
    }
    fun.subscribe(categoryList => {
      let response: any = categoryList
      let data = {}
     // console.log(response);
      data = response.data
      this.items2 = response.data.rows
      this.sub_items = response.data.rows;
      this.totalArrayLimit2 = this.items2.length;
      // if(this.paramId){
      //   for(let i of response.data.rows){
      //     if(i.id==this.paramId){
      //       this.currentCategoryName=i.product_category;
      //     }
      //   }
      // }
      for (var i = 0; i < this.arrayLimit; i++) {
        if (this.items2[i]) {
          this.categoryList2.push(this.items2[i]);
        }
      }
      this.currentLimit2 = this.categoryList2.length;
      this.connectLoader = false
    })
  }

  /*----------------------- preferd products list ---------------------*/

  categoriesPreferredList() {
    this.preferedProductList = [];
    const preferred = {
      category_id: []
    }
    this.connectLoader = true;
    this.offset = 0;
    this.limit = 10;
    this.user.categoriesPrefered(preferred, this.offset, this.limit).subscribe(preferedProductList => {
   //   console.log("ddd",preferedProductList)
      if (preferedProductList["success"] === true) {
        
        if (preferedProductList["data"].rows.length > 0) {
          let response: any = preferedProductList
          let data = [];
          data = response.data.rows;
          this.preferedProductScrollListOne = data;
          this.preferredProductVariantImage(data);
        } else {
          this.connectLoader = false;
          this.tempProductListArr = [];
          this.preferedProductList = [];
          this.toasterService.Warning("No record found");
        }
      }
    })
  }

  onScrollDown1() {
    this.offset += this.limit;
    const preferred = {
      category_id: []
    }
    this.user.categoriesPrefered(preferred, this.offset, this.limit).subscribe(preferedProductList => {
      if (preferedProductList["success"] === true) {
        if (preferedProductList["data"].rows.length > 0) {
          for (let j = 0; j < preferedProductList["data"].rows.length; j++) {
            this.preferedProductScrollListOne['push'](preferedProductList["data"].rows[j]);
          }
          this.preferredProductVariantImage(this.preferedProductScrollListOne);
        }
      }
    });
  }

  preferredProductVariantImage(data) {
    this.tempProductListArr = [];
    data.forEach((product, i) => {
      if (product.product_variants.length > 0) {
        product.product_variants.forEach((variant, j) => {
          if (variant.product_images.length > 0) {
            let results = variant.product_images.filter((x, k) => {
              if (x.is_feature === "yes") {
                return x.is_feature && x.product_variant_image_150x150;
              }
            });
           // console.log(results)

            if (results.length > 0) {
              this.tempProductListArr.push({
                ids: product.id, product_name: product.product_name,
                product_variants: variant, featured_image: results[0].product_variant_image_150x150,
                is_feature: results[0].is_feature, category_id: product.master_product_category_id
              })
            } else {
              if (variant.product_images[0].product_variant_image_150x150) {
                this.tempProductListArr.push({
                  ids: product.id, product_name: product.product_name,
                  product_variants: variant, featured_image: variant.product_images[0].product_variant_image_500x500,
                  is_feature: 'no', category_id: product.master_product_category_id
                })
              } else {
                this.tempProductListArr.push({
                  ids: product.id, product_name: product.product_name,
                  product_variants: variant, featured_image: this.default_image,
                  is_feature: results[0].is_feature, category_id: product.master_product_category_id
                })
              }
            }
          } else {
            let result3 = this.default_image;
            this.tempProductListArr.push({
              ids: product.id, product_name: product.product_name,
              product_variants: variant, featured_image: result3,
              is_feature: 'no', category_id: product.master_product_category_id
            })
          }
        });
      } else {
        this.toasterService.Warning("Product variant not found");
      }
    });
    this.preferedProductList = ([this.tempProductListArr]);

    this.currentLimit = this.preferedProductList.length;
    this.connectLoader = false;
  }

  categoriesFilterList() {
    const filter = {
      "category_ids": [
      ],
      "base_price": {
      }
    }
    this.user.categoriesFilter(filter).subscribe(filterProductList => {
      console.log(filterProductList)
      let response: any = filterProductList
      let data = []
      data = response.data
      this.filterProductList = data['rows'][0]['product_variants'];
    })
  }

  allProductDetails() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      if (this.userData) {
        this.user.getProductCategoryDetails(id).subscribe(productDetails => {
          let response: any = productDetails
          let data = []
          data = response.data
          this.productDetails = data;
        })
      } else {
        this.user.getHomeProductCategoryDetails(id).subscribe(productDetails => {
          let response: any = productDetails
          let data = []
          data = response.data
          this.productDetails = data;
        })
      }
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
          return "" + value;
      }
    }
  };

  priceFilterCheckbox(e) {
    if (e.target.checked) {
      this.priceFilterStatus = true;
    } else {
      this.priceFilterStatus = false;
    }
    if (this.stock) {
      this.stock = this.stock;
    } else {
      this.stock = '';
    }
    if (e.target.checked && !this.minPrice && !this.maxPrice && this.categoryID.length === 0) {
      this.filterArray = {
        "category_ids": this.paramId,
        "base_price": {
          "min": 50,
          "max": 50000
        },
        "stock": this.stock
      };
    } else if (e.target.checked && !this.minPrice && !this.maxPrice && this.categoryID.length > 0) {
      this.filterArray = {
        "category_ids": this.categoryID,
        "base_price": {
          "min": 50,
          "max": 50000
        },
        "stock": this.stock
      };
    } else if (e.target.checked && this.minPrice && this.maxPrice && this.categoryID.length === 0) {
      this.filterArray = {
        "category_ids": this.paramId,
        "base_price": {
          "min": this.minPrice,
          "max": this.maxPrice
        },
        "stock": this.stock
      };
    } else if (e.target.checked && this.minPrice && this.maxPrice && this.categoryID.length > 0) {
      this.filterArray = {
        "category_ids": this.categoryID,
        "base_price": {
          "min": this.minPrice,
          "max": this.maxPrice
        },
        "stock": this.stock
      };
    } else if (!e.target.checked && this.categoryID.length > 0) {
      this.filterArray = {
        "category_ids": this.categoryID,
        "base_price": {},
        "stock": this.stock
      };
    } else if (!e.target.checked && this.categoryID.length === 0) {
      this.filterArray = {
        "category_ids": this.paramId,
        "base_price": {},
        "stock": this.stock
      };
    }
    this.totalArrayLimit = [];
    this.getFilteredProductList('filter', this.filterArray, this.page);
  }

  filterProductByPrice(e) {
    this.minPrice = e.value;
    this.maxPrice = e.highValue;
    if (this.stock) {
      this.stock = this.stock;
    } else {
      this.stock = '';
    }
    if (this.categoryID.length > 0) {
      this.filterArray = {
        "category_ids": this.categoryID,
        "base_price": {
          "min": this.minPrice,
          "max": this.maxPrice
        },
        "stock": this.stock
      };
    } else if (this.categoryID.length === 0) {
      this.filterArray = {
        "category_ids": this.paramId,
        "base_price": {
          "min": this.minPrice,
          "max": this.maxPrice
        },
        "stock": this.stock
      };
    }
    if (this.priceFilterStatus) {
      this.totalArrayLimit = [];
      this.getFilteredProductList('filter', this.filterArray, this.page);
    } else {
      this.toasterService.Warning("Please apply price filter");
    }
  }

  getFilterProductByCategory(val, e) {
    this.connectLoader = true;
    if (this.stock) {
      this.stock = this.stock;
    } else {
      this.stock = '';
    }
    if (e.checked) {
      this.categoryID.push(val.id);
    } else {
      var whatIndex = null;
      this.categoryID.forEach(function (value, index) {
        if (value === val.id) {
          whatIndex = index;
        }
      });
      this.categoryID.splice(whatIndex, 1);
    }
    if (this.categoryID.length > 0) {
      if (this.priceFilterStatus && this.minPrice && this.maxPrice) {
        this.filterArray = {
          "category_ids": this.categoryID,
          "base_price": {
            "min": this.minPrice,
            "max": this.maxPrice
          },
          "stock": this.stock
        };
      } else if (this.priceFilterStatus && !this.minPrice && !this.maxPrice) {
        this.filterArray = {
          "category_ids": this.categoryID,
          "base_price": {
            "min": 50,
            "max": 50000
          },
          "stock": this.stock
        };
      } else if (!this.priceFilterStatus) {
        this.filterArray = {
          "category_ids": this.categoryID,
          "base_price": {},
          "stock": this.stock
        };
      }
    } else {
      if (this.priceFilterStatus && !this.minPrice && !this.maxPrice) {
        this.filterArray = {
          "category_ids": this.paramId,
          "base_price": {
            "min": 50,
            "max": 50000
          },
          "stock": this.stock
        };
      } else if (this.priceFilterStatus && this.minPrice && this.maxPrice) {
        this.filterArray = {
          "category_ids": this.paramId,
          "base_price": {
            "min": this.minPrice,
            "max": this.maxPrice
          },
          "stock": this.stock
        };
      } else if (!this.priceFilterStatus) {
        this.filterArray = {
          "category_ids": this.paramId,
          "base_price": {},
          "stock": this.stock
        };
      }
    }
    this.totalArrayLimit = [];
    this.getFilteredProductList('filter', this.filterArray, this.page);
  }

  trimSearchData(evt: any) {
    this.connectLoader = true;
    if (this.stockStatus && this.stock) {
      if (this.categoryID.length > 0) {
        if (this.priceFilterStatus && this.minPrice && this.maxPrice) {
          this.filterArray = {
            "category_ids": this.categoryID,
            "base_price": {
              "min": this.minPrice,
              "max": this.maxPrice
            },
            "stock": this.stock
          };
        } else if (this.priceFilterStatus && !this.minPrice && !this.maxPrice) {
          this.filterArray = {
            "category_ids": this.categoryID,
            "base_price": {
              "min": 50,
              "max": 50000
            },
            "stock": this.stock
          };
        } else if (!this.priceFilterStatus) {
          this.filterArray = {
            "category_ids": this.categoryID,
            "base_price": {},
            "stock": this.stock
          };
        }
      } else {
        if (this.priceFilterStatus && !this.minPrice && !this.maxPrice) {
          this.filterArray = {
            "category_ids": this.paramId,
            "base_price": {
              "min": 50,
              "max": 50000
            },
            "stock": this.stock
          };
        } else if (this.priceFilterStatus && this.minPrice && this.maxPrice) {
          this.filterArray = {
            "category_ids": this.paramId,
            "base_price": {
              "min": this.minPrice,
              "max": this.maxPrice
            },
            "stock": this.stock
          };
        } else if (!this.priceFilterStatus) {
          this.filterArray = {
            "category_ids": this.paramId,
            "base_price": {},
            "stock": this.stock
          };
        }
      }
      this.totalArrayLimit = [];
      this.getFilteredProductList('filter', this.filterArray, this.page);
    } else {
      this.connectLoader = false;
    }
  }

  /*-------------------- common function for filter API calling -------------*/

  getFilteredProductList(loadType, filterArray, page,sort='hstock') {
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
  // console.log(filterArray)
    let fun;
    if (this.userData) {     
      fun = this.user.getFilteredProduct(filterArray, this.search, this.offset, this.limit,sort);    
    } else {
      fun = this.user.getHomeFilteredProduct(filterArray, this.search, this.offset, this.limit,sort);
    }
    fun.subscribe(categoryDetails => {      
      if (categoryDetails.success == true) {      
        if (categoryDetails.data["rows"].length > 0) {        
          this.filterList = true;
          let response: any = categoryDetails;
          let data = [];
          data = response.data["rows"];
          this.preferedProductScrollList = data;
          this.totalQueryableData = categoryDetails["data"].total;
          this.currentCategoryName=categoryDetails["data"].product_category;
          //this.preferedProductList=response.data["rows"];
         //console.log( this.preferedProductList)
          this.filterVariantImage(data, categoryDetails["data"].total);
          this.connectLoader = false;
        } else {
          this.connectLoader = false;
          this.tempProductListArr = [];
          this.preferedProductList = [];
          if (loadType === 'onload') {
            this.filterStatus = true;
          } else {
            this.filterStatus = false;
          }
          this.isListLoading = false;
          this.toasterService.Warning("No record found");
        }
      }
    });
  }

  handlePageChange(newPage) {
    if (newPage) {
      let Arr;
      let search_text;
      this.type = this.type;
      this.sort('base_price', this.type);
      if (!this.priceFilterStatus && this.categoryID.length == 0) {
        Arr = {};
        search_text = this.search;
      } else {
        Arr = this.filterScrollArray;
        search_text = '';
      }
      const limit = this.pageSize || 10;
      this.limit = limit;
      let data = {
        page: newPage
      }
      this.page = newPage;
      this.offset = (data.page - 1) * limit;
      this.isListLoading = true;
      let fun;
      if (this.userData) {
        fun = this.user.getFilteredProduct(this.filterScrollArray, this.search, this.offset, this.limit,this.recordsSortBy);
      } else {
        fun = this.user.getHomeFilteredProduct(this.filterScrollArray, this.search, this.offset, this.limit);
      }
      fun.subscribe(categoryDetails => {
        if (categoryDetails["success"] === true) {
          if (categoryDetails["data"].rows.length > 0) {
            this.filterVariantImage(categoryDetails["data"].rows, categoryDetails["data"].total);
          }
        }
      });
    }
  }

  /*------------- function for filter products variant image condition --------------*/

  filterVariantImage(productData, total) {
   
    this.tempProductListArr = [];
    this.preferedProductList = [];
   
    productData.forEach((product, i) => {     
      if (product) {      
     if (product.product_images.length > 0) {            
            let results = product.product_images.filter((x, k) => {
              if (x.is_feature == "yes") {        
               
                return x.is_feature && x.product_variant_image_150x150;
              }else{
                return x;
              }
            });          
           
            if (results) {  

              this.tempProductListArr.push({
                ids: product.master_product.id, product_name: product.product_name,
                product_variants: product, featured_image: results[0].product_variant_image_150x150,
                is_feature: results[0].is_feature, id: product.id
              })
            } else {                      
              if (product.product_images[0].product_variant_image_150x150) {
                this.tempProductListArr.push({
                  ids: product.master_product.id, product_name: product.product_name,
                  product_variants: product, featured_image: product.product_images[0].product_variant_image_150x150,
                  is_feature: 'no', id: product.id
                })
              } else {
                this.tempProductListArr.push({
                  ids: product.master_product.id, product_name: product.product_name,
                  product_variants: product, featured_image: this.default_image,
                  is_feature: 'no', id: product.id
                })
              }
            }
          } else {
            let result3 = this.default_image;
            this.tempProductListArr.push({
              ids: product.master_product.id, product_name: product.product_name,
              product_variants: product, featured_image: result3,
              is_feature: 'no', id: product.id
            })
          }
       // });
      } else {
        this.toasterService.Warning("Product variant not found");
      }
    });
  
    this.totalArrayLimit = total;
    this.preferedProductList = this.tempProductListArr;
   // console.log( this.preferedProductList[0])
    this.preferedProductList.map((x: any) => {
      this.productId.push(x.id);
    })
    this.isListLoading = false;
    this.currentLimit = this.preferedProductList.length;
    //this.sort('base_price', this.type);
  }

  sortBySelectionChange(event) {
   // console.log(this.recordsSortBy);
   // console.log(event.value);
   this.recordsSortBy=event.value
    this.getFilteredProductList('filter', this.filterScrollArray, this.page,event.value);
   /* switch (event.value) {
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

  productDetailDealsRoute2(c_id, product_id, variant_id) {
    this.router.navigate(['categories', c_id, product_id, variant_id]);
  }

  help_message() {
    let msg = 'Request Callback is Call we will contact Shortly';
    this.toasterService.Success(msg);
  }

  onFileChange(files: FileList) {
    this.fileUpload = files.item(0);
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  onSubmit(quoteForm) {
    const uploadData = new FormData();
    uploadData.append('title', quoteForm.value.title);
    uploadData.append('description', quoteForm.value.description);
    uploadData.append('request_image', this.fileUpload);
    this._api.apiPost(API.QUEST_ENDPOINTS.CREATE_REQUESTWITHQUOTES, uploadData, {},
      { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          if (result.message) {
            this.router.navigate(['/prefered-products']);
            this.toasterService.Success('Request Call For Quote created successfully!');
          } else {
            let msg = 'Process failed.';
            quoteForm.reset();
            this.toasterService.Error(msg);
          }
          this.isCreateProcessing = false;
          this.isSingleUploaded = false;
        },
        error: err => {
          if (err) {
            this.toasterService.Error(err);
          } else {
            this.toasterService.Error("Validation error: Request Call For Quote only allow letters and space.");
          }
          this.isCreateProcessing = false;
        },
        complete: () => {
          this.isCreateProcessing = false;
        }
      });
  }
  openDialog() {
    const dialogRef = this.dailog.open(RoadBlockBannerComponent, {
      panelClass: "add-user-dialog",
      width: '780px'
    })
  }

  setAllCheckbox(event) {
    this.checkedAll = !this.checkedAll;
  //  console.log(event.checked);
    if (event.checked) {
      this.productCheckedList = this.productId;
      this.count = this.productId.length;
    }
    else {
      this.count = 0;
      this.productCheckedList = [];
    }
   // console.log(this.productCheckedList);
  }

  setSingleCheckbox(event, value) {
    // console.log(event.checked);
    if (event.checked) {
      this.productCheckedList.push(value);
      this.count++;
    } else {
      let index = this.productCheckedList.indexOf(value);
      // console.log(index);
      this.productCheckedList.splice(index, 1);
      this.count--;
    }
    // console.log(this.productCheckedList);
  }

  AddCatalogue() {
    sessionStorage.setItem('filterurl',this.router.url);
    sessionStorage.setItem('filterparam',JSON.stringify({}))
    sessionStorage.setItem('catalogue', JSON.stringify(this.productCheckedList));
    this.router.navigate(['/add-catalogue']);
  }
  collectionDetails(data){
    this.router.navigate(['filtered-products'], 
    { queryParams: { category_id: JSON.stringify(data.master_product_category_id), 
      price: data.filters.base_price.min +' - '+ data.filters.base_price.max, 
      stock: data.filters.stock.min
    } });
  }
  
}


