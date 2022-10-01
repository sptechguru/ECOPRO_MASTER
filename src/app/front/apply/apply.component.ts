import { API } from "app/shared/constants/endpoints";
import { ApiHandlerService } from "./../../shared/services/api-handler.service";
import { Component, OnInit } from "@angular/core";
import { Options, LabelType } from "ng5-slider";
import { UserService } from "app/shared/services/user.service";
import { ToasterService } from "app/shared/services/toaster.service";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';

@Component({
  selector: "app-apply",
  templateUrl: "./apply.component.html",
  styleUrls: ["./apply.component.scss"],
})
export class ApplyComponent implements OnInit {
  categories: any;
  minPrices: any;
  maxPrices: any;
  categoryPreferedArray: Array<any> = [];
  categoryID: Array<any> = [];
  pricePreferedArray: any;
  stockPreferedArray: any;
  minPrices2: any;
  maxPrices2: any;
  productid: any  = 25;
  filterForm: FormGroup;
  constructor(
    private user: UserService,
    private toasterService: ToasterService,
    private router: Router,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private ToasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,

  ) {}

  ngOnInit(): void {
    this.categoriesList();
    this.pricePreferedArray = "0 - 15000";
    this.stockPreferedArray = "0 - 10000";
    this.initform();
  }
  initform() {
    this.filterForm = this.fb.group({
      pmin: ["0", [Validators.required, Validators.pattern("^[0-9]+$")]],
      pmax: ["15000", [Validators.required, Validators.pattern("^[0-9]+$")]],
      smin: ["0", [Validators.required, Validators.pattern("^[0-9]+$")]],
    });
  }

  removeWord(inputvalue: any) {
    const pattern = /^[0-9]+$/i;
    if (!inputvalue.value.match(pattern)) {
      inputvalue.value = "";
    } else {
      console.log("run");
    }
  }

  categoriesList() {
    let offset = 0;
    let limit = 100;
    this.user.headerCategoriesList(offset, limit).subscribe((categoryList) => {
      if (categoryList["success"] == true) {
        this.categories = categoryList["data"].rows;
        console.log(this.categories);
        let arr = this.categories;
        arr.forEach((item) => {
          // console.log(item.id);
          let dataid = item.id;
          this.productid = dataid;
        });
      }
    });
  }

  preferedCategoryArray(e, val) {
    if (e.checked) {
      this.categoryPreferedArray.push(val.id);
    } else {
      var whatIndex = null;
      this.categoryID.forEach(function (value, index) {
        if (value === val.id) {
          whatIndex = index;
        }
      });
      this.categoryPreferedArray.splice(whatIndex, 1);
    }
  }

  minValues: number = 0;
  maxValues: number = 15000;
  optionss: Options = {
    floor: 0,
    ceil: 15000,
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
    },
  };

  filterProductByPrices(e) {
    if (e.value) {
      this.minPrices = e.value;
    } else {
      this.minPrices = 0;
    }
    if (e.highValue) {
      this.maxPrices = e.highValue;
    } else {
      this.maxPrices = 15000;
    }
    this.pricePreferedArray = this.minPrices + " - " + this.maxPrices;
  }

  minValues2: number = 0;
  maxValues2: number = 10000;
  optionss2: Options = {
    floor: 0,
    ceil: 10000,
    step: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min stock: </b>" + value;
        case LabelType.High:
          return "<b>Max stock: </b>" + value;
        default:
          return "" + value;
      }
    },
  };

  filterProductByStock(e) {
    if (e.value) {
      this.minPrices2 = e.value;
    } else {
      this.minPrices2 = 0;
    }
    if (e.highValue) {
      this.maxPrices2 = e.highValue;
    } else {
      this.maxPrices2 = 10000;
    }
    this.stockPreferedArray = this.minPrices2 + " - " + this.maxPrices2;
  }


  applyFilter() {
    if (this.filterForm.invalid) {
      return;
    }
    let data = this.filterForm.value;
    console.log(data);
    let options = {
      offset: 0,
      limit: 100,
    };
    let payload = {
      category_ids: [15],
      base_price: {
        min: data.pmin,
        max: data.pmax,
      },
      stock: { min: data.smin },
    };
    this.apiHandlerService
      .apiPost(API.QUEST_ENDPOINTS.GET_FILTRED_PRODUCTS, payload, options)
      .subscribe(
        (res) => {
          // console.log(res);
          if (res) {
            this.ToasterService.Success(res.message);
           this.router.navigate(["search-filtered-products"]);
          }
        },
        (error) => {
          this.ToasterService.Error(error);
        }
      );
  }
  // if(this.categoryPreferedArray && this.categoryPreferedArray.length>0){
  //   this.router.navigate(['filtered-products'],
  //   { queryParams: { category_id: JSON.stringify(this.categoryPreferedArray),
  //     price: this.filterForm.get('pmin').value+"-"+this.filterForm.get('pmax').value,
  //     stock: this.filterForm.get('smin').value
  //   } });
  // }else{
  //   this.router.navigate(['filtered-products'],
  //   { queryParams: {
  //     price: this.filterForm.get('pmin').value+"-"+this.filterForm.get('pmax').value,
  //     stock: this.filterForm.get('smin').value
  //   } });
  //   this.toasterService.Warning("Please select category");
  // }
}
