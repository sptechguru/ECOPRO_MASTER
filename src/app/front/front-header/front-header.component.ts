import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit,
  ElementRef
} from '@angular/core';
import { Router, Params, NavigationStart, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { GlobalSearchService } from 'app/shared/services/global-search.service';
import { DialogService } from './dialog/dialog.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { UserService } from 'app/shared/services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ThemePalette } from '@angular/material/core';
import { ROUTES } from '../front-sidebar/front-sidebar.component';
import { Title } from '@angular/platform-browser';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-front-header',
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.scss'],
})

export class FrontHeaderComponent implements OnInit, AfterViewInit {

  searchFilters = false;
  category: any;
  price: any;
  stock: any;
  Delivery: any;

  priceLists: any[] = [{ value: '0 - 100', label: '0 - 100' },
  { value: '101 - 500', label: '101 - 500' },
  { value: '501 - 1000', label: '501 - 1,000' },
  { value: '1001 - 1500', label: '1,001 - 1,500' },
  { value: '1500 - 5000', label: '1,500 - 5,000' },
  { value: '5000 - 15000', label: '5,000 - 15,000' },
    //{value:'5,00,000 - ', label: 'Upto 5 Lakh'}
  ];

  stockLists: any[] = [
    { value: '', label: 'Coming Soon...' }
  ];


  onFocusOutEvent() {
    this.searchFilters = false;
  }

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  close() {
    throw new Error('Method not implemented.');
  }
  signup: boolean = false
  loginForms: boolean = false
  isLoginProcessing = false;
  router: string
  searchTerm: any;
  @Input() name: string;
  @Output() notify = new EventEmitter<any>();
  private product: any;
  myControl = new FormControl();
  options: any = [];
  searchInputData: any = [];
  filteredOptions: Observable<string[]>;
  productArray: Array<any> = [];
  cartItemCount: any;
  cartData: any;
  id: any;
  pid: any;
  vid: any;
  term: string = '';
  search_product: any;
  search: any;
  category_id: any;
  loader: boolean = false;
  color: ThemePalette = 'warn';
  not_found: boolean = false;
  profile_pic: any;
  categories: any;
  categoryArray: any;
  priceArray: any;
  stockArray: any;
  deliveryArray: any;
  minPrice: any;
  maxPrice: any;
  minStock: any;
  maxStock: any;
  private listTitles: any[];
  location: Location;

  _isSearchAsTypeOn: boolean;

  @Output() onQuery = new EventEmitter();

  @Input() placeholderText = 'Search...';

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
          } else {
            this.not_found = false;
          }
        }
      });
    }
  }

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _api: ApiHandlerService,
    public localStorage: StorageAccessorService,
    public globalSearchService: GlobalSearchService,
    private commModel: DialogService,
    private ToasterService: ToasterService,
    private user: UserService,
    private _route: ActivatedRoute,
    private titleService: Title,
    location: Location
  ) {
    this.location = location;
    this._router.url;
  }

  @Input() sideNavbar = {
    disableClose: false
  }

  // ngAfterViewInit(){
  //   fromEvent(this.filterText.nativeElement,'keyup')
  //   .pipe(
  //     filter(Boolean),
  //     debounceTime(1000),
  //     distinctUntilChanged(),
  //     tap(()=>{
  //       const searchInput = this.filterText.nativeElement.value.trim()
  //       this.searchInput.emit(searchInput)
  //       // this.getManagerList()
  //     })
  //   ).subscribe()
  // }

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.globalSearchService.searchTerm.subscribe((newValue: string) => {
      this.searchTerm = newValue;
    });
    this._route.queryParams.subscribe(params => {
      this.search = params['search'];
    });

    // this.localStorage.deleteAllSearchData()
    if (this.localStorage.fetchSearchData()) {
      let getSearchData: any = [];
      getSearchData = this.localStorage.fetchSearchData();
      getSearchData.forEach(element => {
        this.options.push({
          'category_id': element.category_id,
          'pid': element.pid,
          'variant_name': element.variant_name
        });
      });
      this.loader = false;
    } else {
      this.myControl.setValue(this.search);
    }

    this._route.queryParams.subscribe(params => {
      if (params['category_id']) {
        this.category_id = JSON.parse(params['category_id']);
        this.category = this.category_id;
        this.selectCategories(this.category);
      }
      if (params['price']) {
        this.price = params['price'];
      }
      if (params['stock']) {
        this.stock = params['stock'];
      }
    });

    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this._router.events.subscribe((val) => {
      this.setTitle(this.getTitle())
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    //console.log(this.listTitles);
    for (var item = 0; item < this.listTitles.length; item++) {
      let title = titlee.split("/");
      if (this.listTitles[item].path === title[1]) {
        return this.listTitles[item].title;
      }
    }
    return 'Ek Matra';
  }

  get BusinessKyc() {
    let b_kyc = JSON.parse(localStorage.getItem("kyc"));
    if (b_kyc) {
      return b_kyc.business_kyc
    } else return ''
  }

  get PersonalKyc() {
    let p_kyc = JSON.parse(localStorage.getItem("kyc"));
    if (p_kyc) {
      return p_kyc.personel_kyc
    } else return ''
  }

  get billing() {
    let billing = JSON.parse(localStorage.getItem("billing"));
    if (billing) {
      return true;
    } else return false;
  }

  
  onFocusEvent() {
    // this.searchFilters = true;
    // this.categoriesList();
    // this.user.getTrandingSearchProduct().subscribe(preferedProductList => {
    //   this.loader = false;
    //   if (this.productArray.length === 0) {
    //     preferedProductList["data"].rows.forEach(value => {
    //       this.productArray.push({
    //         "variant_name": value.tag_name,
    //         "pid": '',
    //         "category_id": ''
    //       });
    //     });
    //   }
    //   if (this.productArray && this.productArray.length > 0) {
    //     this.options = this.productArray;
    //     this.not_found = false;
    //   } else {
    //     this.not_found = true;
    //   }
    // });
  }

  trimSearchData(evt: any) {
    let filterArray = {};
    this.loader = true;
    this.productArray = [];
    
    if (!(this.myControl.value == '')) { // Store Search input Data
      this.options.push({
        "pid": '',
        "category_id": '',
        'variant_name': this.myControl.value
      });
      this.loader = false;
      this.localStorage.StoreSearchData(this.options);
    }

    /*this.user.getSearchProduct(filterArray, this.term, 0, 5).subscribe(preferedProductList => {
      this.loader = false;
      if (this.productArray.length === 0) {
        preferedProductList["data"].rows.forEach(value => {
          value.product_variants.forEach(variant => {
            this.productArray.push({
             "variant_name": variant.variant_name,
             "pid": value.master_product_category.parent_category, 
             "category_id": value.master_product_category_id
            });
          });
        });
      }
      if(this.productArray && this.productArray.length>0){
        this.options = this.productArray;
        this.not_found = false;
      }else{
        this.not_found = true;
      }      
    });*/


    this.user.getSearchProduct2(filterArray, this.term, 0, 5).subscribe(preferedProductList => {
      this.loader = false;
      if (this.productArray.length === 0) {
        preferedProductList["data"].rows.forEach(value => {
          this.productArray.push({
            "variant_name": value.tag_name,
            "pid": '',
            "category_id": ''
          });
        });
      }
      if (this.productArray && this.productArray.length > 0) {
        this.options = this.productArray;
        this.not_found = false;
      } else {
        this.not_found = true;
      }
    });
  }

  save(e) {
    // console.log(e, 'e');
    // console.log(e.target.value, 'e');

    this._router.navigate(['search-filtered-products'],
      { queryParams: { search: e.target.value } })
  }

  resetAutoInput(trigger: MatAutocompleteTrigger, auto: MatAutocomplete) {
    setTimeout(_ => {
      auto.options.forEach((item) => {
        item.deselect()
      });
      this.myControl.reset('');
      trigger.openPanel();
    }, 100);
  }

  getProductDetail(evt: any, variantDetail) {
    // console.log(evt, 'evt');
    // console.log(variantDetail, 'variantDetaillllll');

    this._router.navigate(['search-filtered-products'], { queryParams: { search: variantDetail.variant_name } })
  }

  clearSearchField() {
    this._router.navigate(['prefered-products']);
  }

  cart() {
    if (this.cartItem) {
      this._router.navigate(["/cart"]);
    } else {
      this.ToasterService.Error("Your cart is empty");
    }
  }

  emptyCart() {
    this.ToasterService.Error("Please complete your KYC and Billing address for further processing.");
  }

  searchProduct() {
    if (this.product) {

    } else {
      this.ToasterService.Error("Please enter product name");
    }
  }

  public onInput(event: any) {
    this.globalSearchService.searchTerm.next(event.target.value);
  }

  showLogin() {
    this.commModel.openLoginDialog().subscribe(data => {
    });
  }

  showSignup() {
    this.commModel.openSignupDialog().subscribe(data => {
    });
  }

  logout() {
    this._api.apiGet(API.AUTH_ENDPOINTS.LOGOUT).subscribe({
      next: result => {
        this.localStorage.deleteToken()
        localStorage.removeItem("kyc");
        localStorage.removeItem("billing");
        this._router.navigate(['/'])
      },
      error: err => {
      },
    })
  }

  get signInStatus() {
    let data = this.localStorage.fetchData();
    let kyc = JSON.parse(localStorage.getItem("kyc"));
    if (data) {
      if (kyc && data.questinarie) return 'DashBoard'
      if (data.questinarie) return 'Complete Kyc'
      if (!data.questinarie) return 'Complete Questionnaire Details'
    } else return ''
  }

  get cartItem() {
    let cartData = JSON.parse(localStorage.getItem('cartData'));
    // let userData = JSON.parse(localStorage.getItem('userData'));
    let userData = this.localStorage.fetchData();
    if (cartData && cartData.length > 0) {
      let result2 = cartData.filter((x, k) => {
        if (x.user_id === userData["data"].id) {
          return cartData;
        }
      });
      this.cartData = result2;
    } else {
      this.cartData = [];
    }
    return this.cartData.length;
  }

  routeUser() {
    let data = this.localStorage.fetchData();
    let kyc = JSON.parse(localStorage.getItem("kyc"));
    if (data) {
      if (kyc.business_kyc === 'yes' && kyc.personel_kyc === 'yes' && data.questinarie)
        return this._router.navigate(['categories'])
      if (data.questinarie) return this._router.navigate(['kyc/kycform'])
      if (!data.questinarie) return this._router.navigate(['ques/questions'])
    } else return ''
  }

  categoriesList() {
    if (!this.categories) {
      let offset = 0;
      let limit = 100;
      this.user.headerCategoriesList(offset, limit).subscribe(categoryList => {
        if (categoryList["success"] == true) {
          this.categories = categoryList["data"].rows;
        }
      })
    }
  }

  selectCategories(val) {
    this.categoryArray = val;
  }

  selectPrice(val) {
    this.priceArray = val;
  }

  selectStock(val) {
    //this.stockArray = val;
  }

  handleChange(val) {
    this.deliveryArray = val;
  }

  searchData() {
    if (this.categoryArray && this.categoryArray.length > 0) {
      this._router.navigate(['filtered-products'],
        {
          queryParams: {
            category_id: JSON.stringify(this.categoryArray),
            price: this.priceArray,
            // stock: this.stockArray 
          }
        });
    } else {
      this.ToasterService.Warning("Please select category");
    }
  }

  clearData() {
    this.categoryArray = [];
    this.priceArray = [];
    //this.stockArray = [];
    this.deliveryArray = [];
    this.category = '';
    this.price = '';
    //this.stock = '';
    this._router.navigate(['filtered-products']);
  }

  closeModel() {
    this.searchFilters = false;
  }

  lookingFor() {
    this._router.navigate(['/search']);
  }

}
