import { MatDialog } from '@angular/material/dialog';
import { KycComponent } from './../kyc/kyc.component';
import { Component, OnInit } from '@angular/core';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Component({
  selector: 'app-search-deals-product',
  templateUrl: './search-deals-product.component.html',
  styleUrls: ['./search-deals-product.component.css']
})
export class SearchDealsProductComponent implements OnInit {

  deals_id: any;
  dealsProduct: any;
  default_image: any;
  loader: boolean = false;
  isDesc: boolean = false;
  column: string = 'CategoryName';
  type: any;
  scrollDistance = 1;
  scrollUpDistance = 2;
  throttle = 300;
  collectionStatus = false;
  collectionList = [];
  recordsSortBy: string = 'hstock';
  kycdata: any;
  gstno: any;
  gststatus: any;


  constructor(private _route: ActivatedRoute, private _api: ApiHandlerService,
    private toasterService: ToasterService, private route: Router,
    public matDialog: MatDialog,) { }

  ngOnInit(): void {
    this.kycdata = localStorage.getItem('kyc');
    //  console.log(this.kycdata)
    if (this.kycdata != null) {
      let newkycdd = JSON.parse(this.kycdata);
      this.gstno = newkycdd.gst_no;
      this.gststatus = newkycdd.gst_status;
      // console.log(this.gststatus)
    }

    this.deals_id = this._route.snapshot.paramMap.get('deals_id');
    if (this.deals_id == 'collection') {
      this.collectionStatus = true;
      this.getCollection();
    }
    else {
      this.collectionStatus = false;
      this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
      this.getDealsProductById(this.deals_id);
    }
  }


  openDialogs(): any {
    const dailog = this.matDialog.open(KycComponent);
    dailog.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  getCollection() {
    console.log("yesss")
    this._api.apiGet(API.COLLECTION.COLLECTION_LIST + '?offset=0&limit=100').pipe().subscribe(
      {
        next: data => {
          // console.log(data);
          if (data["success"] = true) {
            this.collectionList = data.data.rows;
            // console.log(this.collectionList);
          }
        },
        error: err => { },
        complete: () => { }
      }
    )
  }
  Filter(data) {
    this.route.navigate(['filtered-products'],
      {
        queryParams: {
          category_id: JSON.stringify(data.master_product_category_id),
          price: data.filters.base_price.min + ' - ' + data.filters.base_price.max,
          stock: data.filters.stock.min
        }
      });
  }
  getDealsProductById(deals_id, sort = 'hstock') {
    this.loader = true;
    this._api.apiGet(API.DEALS.DEALS_PRODUCT_BY_ID + '/' + deals_id + '?sort_by=' + sort).pipe().subscribe(
      {
        next: data => {
          if (data["success"] = true) {
            let dealsProduct = data.data["rows"];
            dealsProduct.forEach((product, i) => {
              if (product.id == deals_id) {
                if (product.product_variants.length > 0) {
                  product.product_variants.forEach((variant, j) => {
                    if (variant.product_images.length > 0) {
                      let results = variant.product_images.filter((x, k) => {
                        if (x.is_feature === "yes") {
                          return x.is_feature && x.product_variant_image_150x150;
                        }
                      });
                      /*let result2 = variant.product_images.filter((x,k) => {
                        if(x.is_feature === "no"){
                          return x.is_feature && x.product_variant_image_150x150;
                        }
                      });*/

                      if (results.length > 0) {
                        variant["image"] = results[0].product_variant_image_150x150;
                      } else {
                        if (variant.product_images[0].product_variant_image_500x500) {
                          variant["image"] = variant.product_images[0].product_variant_image_500x500;
                        } else {
                          variant["image"] = this.default_image;
                        }
                        //variant["image"] = result2[0].product_variant_image_150x150;
                      }
                    } else {
                      let result3 = this.default_image;
                      variant["image"] = result3;
                    }
                  });
                }
                this.dealsProduct = product;
                // console.log(this.dealsProduct);
                let ar = [];
                for (let i of this.dealsProduct.product_variants) {
                  if (i.default == 'yes') {
                    ar.push(i);
                  }
                }
                this.dealsProduct.product_variants = ar;
                //this.sort('base_price', 'low');
                this.loader = false;
              }
            });
          }
        },
        error: err => { },
        complete: () => { }
      }
    )
  }

  sortBySelectionChange(event) {
    this.getDealsProductById(this.deals_id, event.value)
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

    if (property === 'created_at') {
      this.dealsProduct.product_variants.sort(function (a, b) {
        // console.log(a);
        //console.log(b)
        let a_time = new Date(a.deal_product.created_at);
        let b_time = new Date(b.deal_product.created_at);
        // console.log(a.deal_product.created_at+"  "+b.deal_product.created_at);
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
      this.dealsProduct.product_variants.sort(function (a, b) {
        if (a[property] < b[property]) {
          return -1 * direction;
        }
        else if (a[property] > b[property]) {
          return 1 * direction;
        }
        else {
          return 0;
        }
      });
    }
  };
  /*
  sort(property, type) {
    this.type = type;
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.dealsProduct.product_variants.sort(function (a, b) {
      if (a[property] < b[property]) {
        return -1 * direction;
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  };
*/
  productDetailDealsRoute(deals_id, product_id, variant_id) {
    this.route.navigate(['categories', deals_id, product_id, variant_id],
      { queryParams: { deals: true } })
  }

  onScrollDown() {

  }

}
