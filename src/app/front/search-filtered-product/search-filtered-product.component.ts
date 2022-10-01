import { MatDialog } from '@angular/material/dialog';
import { KycComponent } from './../kyc/kyc.component';
import {
  Component, Input, OnInit, Injectable, HostListener, ViewChild, AfterViewInit,
  ElementRef
} from '@angular/core';
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
import { Observable } from 'rxjs';
import { SortByPipe } from 'app/shared/pipes/product-list-sort.pipe';

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
  previousQury: any = { queryParams: {} };
  constructor(private _route: ActivatedRoute, private user: UserService) {
    this._route.queryParams.subscribe(params => {
      this.search = params['search'];
      this.initialize();
    });
  }

  initialize() {
    this.user.categoriesList().subscribe(productCategoryDetails => {
      if (productCategoryDetails["success"] === true) {
        let data;
        const TREE_DATA = productCategoryDetails["data"]["rows"];
        this.dataChange.next(TREE_DATA);
      }
    })
  }
}

@Component({
  selector: 'app-search-filtered-product',
  templateUrl: './search-filtered-product.component.html',
  styleUrls: ['./search-filtered-product.component.scss'],
  providers: [ChecklistDatabase, SortByPipe]
})
export class SearchFilteredProductComponent implements OnInit {
  recordsSortBy: string = 'hstock';
  productId = [];
  productCheckedList = [];
  count = 0;
  checkedAll = false;
  categoryList = []
  showMoreCategory: any;
  nextPage: any;
  tempArray: any;
  arrayLimit: any;
  currentLimit: any;
  totalArrayLimit: any;
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
  items2: [];
  totalArrayLimit2: any;
  categoryList2 = [];
  currentLimit2: any;
  type: any;
  isDesc: boolean = false;
  column: string = 'CategoryName';
  categoryDetails: any;
  totalQueryableData: number = 0;
  pageSize: number = 10;
  page: number;
  offsets: any;
  sorting_type: any;
  isListLoading: boolean = false;
  kycdata: any;
  gstno: any;
  gststatus: any;
  previousQury: any = { queryParams: {} };
  @ViewChild('searchInput') searchEl: ElementRef;

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
    private matDialog: MatDialog
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
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

  ngOnInit() {
    this.kycdata = localStorage.getItem('kyc');
    //  console.log(this.kycdata)
    if (this.kycdata != null) {
      let newkycdd = JSON.parse(this.kycdata);
      this.gstno = newkycdd.gst_no;
      this.gststatus = newkycdd.gst_status;
      // console.log(this.gststatus)
    }
    this.categoriesList();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._route.queryParams.subscribe(params => {
      this.search = params['search'];
      this.previousQury.queryParams.search = params['search'];
    });
    let filterArray = {};
    this.page = 1;
    this.getFilteredProductList('onload', filterArray, this.page);
    this.showMoreData = false;
    this.arrayLimit = 10;
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
    this.type = 'low';
  }

  openDialogs(): any {
    const dailog = this.matDialog.open(KycComponent);
    dailog.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  productDetailDealsRoute(c_id, product_id, variant_id) {
    this.router.navigate(['categories', c_id, product_id, variant_id]);
  }

  categoriesList() {
    this.connectLoader = true
    this.user.categoriesList().subscribe(categoryList => {
      let response: any = categoryList
      let data = {}
      data = response.data
      this.items2 = response.data.rows
      this.totalArrayLimit2 = this.items2.length;
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
  categoriesFilterList() {
    const filter = {
      "category_ids": [
      ],
      "base_price": {
      }
    }
    this.user.categoriesFilter(filter).subscribe(filterProductList => {

      let response: any = filterProductList
      let data = []
      data = response.data
      this.filterProductList = data['rows'][0]['product_variants'];
    })
  }

  allProductDetails() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.user.getProductCategoryDetails(id).subscribe(productDetails => {
        let response: any = productDetails
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
    console.log(this.router);
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

  getFilteredProductList(loadType, filterArray, page, sort = 'hstock') {
    let Arr;
    let search_text;
    if (!this.priceFilterStatus && this.categoryID.length == 0) {
      Arr = {};
      search_text = this.search;
    } else {
      Arr = filterArray;
      search_text = '';
    }
    this.isListLoading = true;
    const limit = this.pageSize || 10;
    this.limit = limit;
    let data = {
      page: page
    }
    this.offset = (data.page - 1) * limit;

    //this.offset = 0;
    // this.limit = 10;
    this.connectLoader = true;
    this.loadType = loadType;
    this.filterScrollArray = Arr;
    this.user.getFilteredProductByTag(Arr, search_text, this.offset, this.limit, sort).subscribe(categoryDetails => {
      console.log(categoryDetails)
      if (categoryDetails["success"] === true) {

        if (categoryDetails["data"].rows) {

          this.filterList = true;
          let response: any = categoryDetails;
          let data = [];
          data = response.data.rows;
          this.preferedProductScrollList = data;
          this.totalQueryableData = categoryDetails["data"].total;
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
      //this.queryObject.page = newPage;
      //this.getAllUserList(this.queryObject);
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
      //this.offset += this.limit;
      const limit = this.pageSize || 10;
      this.limit = limit;
      let data = {
        page: newPage
      }

      this.page = newPage;
      this.offset = (data.page - 1) * limit;
      this.isListLoading = true;
      this.user.getFilteredProductByTag(Arr, search_text, this.offset, this.limit)
        .subscribe(categoryDetails => {

          if (categoryDetails["success"] === true) {

            if (categoryDetails["data"].rows) {

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

  onScrollDown() {
    /*let Arr;
    let search_text;
    if(!this.priceFilterStatus && this.categoryID.length == 0){
      Arr = {};
      search_text = this.search;
    }else{
      Arr = this.filterScrollArray;
      search_text = '';
    }
    this.offset += this.limit;
    this.user.getFilteredProductByTag(Arr, search_text, this.offset, this.limit)
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

  filterVariantImage(productData, total) {

    this.tempProductListArr = [];
    this.preferedProductList = [];
    productData.forEach((product, i) => {

      if (product.product_images.length > 0) {
        let results = product.product_images.filter((x, k) => {
          if (x.is_feature === "yes") {
            return x.is_feature && x.product_variant_image_150x150;
          }
        });
        if (results.length > 0) {
          this.tempProductListArr.push({
            ids: product.master_product_id, product_name: product.product_name,
            product_variants: product, featured_image: results[0].product_variant_image_150x150,
            is_feature: results[0].is_feature, cid: product.master_product.master_product_category_id,
            id: product.id
          })
        } else {
          if (product.product_images[0].product_variant_image_150x150) {
            this.tempProductListArr.push({
              ids: product.master_product_id, product_name: product.product_name,
              product_variants: product, featured_image: product.product_images[0].product_variant_image_150x150,
              is_feature: 'no', cid: product.master_product.master_product_category_id, id: product.id
            })
          } else {
            this.tempProductListArr.push({
              ids: product.master_product_id, product_name: product.product_name,
              product_variants: product, featured_image: this.default_image,
              is_feature: 'no', cid: product.master_product.master_product_category_id, id: product.id
            })
          }
        }
      } else {
        let result3 = this.default_image;
        this.tempProductListArr.push({
          ids: product.master_product_id, product_name: product.product_name,
          product_variants: product, featured_image: result3,
          is_feature: 'no', cid: product.master_product.master_product_category_id, id: product.id
        })
      }
    });
    //this.totalArrayLimit = this.tempProductListArr.length;
    this.totalArrayLimit = total;
    this.preferedProductList = this.tempProductListArr;
    this.preferedProductList.map((x: any) => {
      this.productId.push(x.id);
    })
    //console.log(this.preferedProductList);
    let ar = [];
    for (let i of this.preferedProductList) {
      if (i.product_variants.default == 'yes') {
        ar.push(i);
      }
    }
    this.preferedProductList = ar;
    //console.log(this.preferedProductList);
    this.isListLoading = false;
    this.currentLimit = this.preferedProductList.length;
    //this.sort('base_price', this.type);
  }


  sortBySelectionChange(event) {
    this.getFilteredProductList('onload', {}, this.page, event.value);
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

    if (property === 'created_at') {
      this.preferedProductList.sort(function (a, b) {
        let a_time = new Date(a.product_variants[property]);
        let b_time = new Date(b.product_variants[property]);
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


  setAllCheckbox(event) {
    this.checkedAll = !this.checkedAll;
    console.log(event.checked);
    if (event.checked) {
      this.productCheckedList = this.productId;
      this.count = this.productId.length;
    }
    else {
      this.count = 0;
      this.productCheckedList = [];
    }
    console.log(this.productCheckedList);
  }

  setSingleCheckbox(event, value) {
    console.log(event.checked);
    if (event.checked) {
      this.productCheckedList.push(value);
      this.count++;
    } else {
      let index = this.productCheckedList.indexOf(value);
      console.log(index);
      this.productCheckedList.splice(index, 1);
      this.count--;
    }
    console.log(this.productCheckedList);
  }

  AddCatalogue() {
    sessionStorage.setItem('filterurl', '/search-filtered-products');
    sessionStorage.setItem('filterparam', JSON.stringify(this.previousQury));
    sessionStorage.setItem('catalogue', JSON.stringify(this.productCheckedList));
    this.router.navigate(['/add-catalogue']);
  }

}
