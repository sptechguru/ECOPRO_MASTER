import { tap } from 'rxjs/operators';
import { KycComponent } from './../kyc/kyc.component';
import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { API } from "app/shared/constants/endpoints";
import { ApiHandlerService } from "app/shared/services/api-handler.service";
import { StorageAccessorService } from "app/shared/services/localstorage-accessor.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UserService } from "app/shared/services/user.service";
import { DialogService } from "../front-header/dialog/dialog.service";
// import { NgxImageZoomModule } from 'ngx-image-zoom';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogRef,
} from "@angular/material/dialog";
import { LiveStockComponent } from "./live-stock/live-stock.component";
import { ReserveStockComponent } from "./reserve-stock/reserve-stock.component";
import { ConfirmationDialogHandlerService } from "app/shared/components/confirmation-dialog/confirmation-dialog-handler.service";
import { environment } from "environments/environment";
import { off } from "process";
import { typeWithParameters } from "@angular/compiler/src/render3/util";
import { Subject } from "rxjs";
//import { DomSanitizationService, SecurityContext, SafeHtml } from '@angular/platform-browser';

import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { ConsoleLogger } from "app/shared/services/consoleLogger.service";
import { KycdilogformComponent } from '../kycdilogform/kycdilogform.component';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: "app-product-details",
    templateUrl: "./product-details.component.html",
    styleUrls: ["./product-details.component.scss"],
})
export class ProductDetailsComponent implements OnInit {
    enableZoom: Boolean = true;
    previewImageSrc = "pathToImage";
    zoomImageSrc = "pathToImage";
    myThumbnail = "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
    myFullresImage =
        "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";

    slideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: ".product-slider-nav",
        infinite: false,
        arrows: false,
        fade: true,
    };
    slideConfig2 = {
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        asNavFor: ".product-slider",
        infinite: false,
        swipeToSlide: true,
        mobileFirst: true,
        // "centerMode" : true,
        // "centerPadding": '60px',
        focusOnSelect: true,
    };
    slideConfig1 = {
        // "slidesToShow": 5,
        slidesToScroll: 1,
        dots: false,
        infinite: false,
        swipeToSlide: true,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 5,
                },
            },
            //   {

            //   breakpoint: 991,
            //   settings: {
            //     slidesToShow: 4,
            //   }

            // },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 574,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    selected;
    quantity = 1;
    id;
    vid;
    pid;
    is_sample: any;
    tempProductListArr = [];
    totalArrayLimit: any;
    arrayLimit: any;
    preferedProductList = [];
    currentLimit: any;
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
    deals: any;
    ship_days: any;
    login_status: boolean;
    sampleProductStatus = false;
    deliveryForm: FormGroup;
    deliveryMsg: string = "";
    shipmentTiming = {};
    leadTime = {};
    gstdata: any;
    kycdata: any;
    gstno: any;
    gststatus: any;
    live_stock_inventory: number = 0;
    emailverify:any;
    validaccount:any;
    moq_ready_stock:any;
    moq_made_for_order:any;

    constructor(
        private _route: ActivatedRoute,
        private _api: ApiHandlerService,
        private fb: FormBuilder,
        public translate: TranslateService,
        public localStorage: StorageAccessorService,
        private toasterService: ToasterService,
        private router: Router,
        private user: UserService,
        private commModel: DialogService,
        public matDialog: MatDialog,
        public dialogRef: MatDialogRef<ProductDetailsComponent>,
        public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
        private spinner: NgxSpinnerService// private ngxImgZoom: NgxImageZoomModule
    ) {
        this.base_url = environment.baseUrl + "" + router.url;
        // this.text = 'http://167.71.226.208:3001/uploads/product_variant_image/thumb/500x500/product_variant_image_Rjmsz_1606310382444.jpg';
        // let imag = "<img src='http://167.71.226.208:3001/uploads/product_variant_image/thumb/500x500/product_variant_image_Rjmsz_1606310382444.jpg' />";
        //console.log(imag);
        // this.ngxImgZoom.setZoomBreakPoints([{w: 100, h: 100}, {w: 150, h: 150}, {w: 200, h: 200}, {w: 250, h: 250}, {w: 300, h: 300}]);
    }

    productDetails: any = { data: {} };
    product: any = [];
    cartType: any;

    ngOnInit(): void {
        this.kycdata = localStorage.getItem('kyc');
        // console.log(this.kycdata)
        if (this.kycdata != null) {
            let newkycdd = JSON.parse(this.kycdata);
            this.gstno = newkycdd.gst_no;
            this.gststatus = newkycdd.gst_status;
        }

        this.spinner.show();
        this._route.queryParams.subscribe((params) => {
            this.deals = params["deals"];
        });
        this.id = this._route.snapshot.paramMap.get("id");
        this.pid = this._route.snapshot.paramMap.get("pid");
        this.vid = this._route.snapshot.paramMap.get("vid");

        if (localStorage.getItem("cartData")) {
            this.cartData = JSON.parse(localStorage.getItem("cartData"));
        }
        if (this.localStorage.fetchData()) {
            this.userData = this.localStorage.fetchData()["data"];
            this.phone_number = "+91" + this.userData.phone_number;
        }
        // console.log("check session validation");
        if (this.userData) {
            this.login_status = true;
        } else {
            this.login_status = false;
        }

        this.allProductDetails(this.id, this.pid, this.vid);
        this.categoriesPreferredList();
        this.arrayLimit = 10;
        this.default_image =
            API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;

        this.deliveryForm = this.fb.group({
            pincode: this.fb.control('', Validators.required),
            unite: this.fb.control(''),
        });

        // this.getKycDetails();
    }

    // getKycDetails() {
    //     this._api.apiGet(API.QUEST_ENDPOINTS.GET_KYC_DETAILS).pipe(
    //         tap({
    //             next: res => {
    //                 // console.log(res.data);
    //                 this.gstdata = res.data;
    //                 // console.log(this.gstdata);

    //             },
    //             error: err => {
    //                 // this.DialogService.setKYC('');
    //                 // this.router.navigate(['kyc/kycform']);
    //             }
    //         })
    //     ).subscribe()
    // }

    // getSampleProduct(id) {
    //     this.user.getSampleProduct(id).subscribe(
    //         (res: any) => {


    //             if (res.data.quantity > 0) {
    //                 this.sampleProductStatus = true;
    //             }
    //         },
    //         (error) => {
    //             console.log(error);
    //         }
    //     );
    // }


    /*---------------------- get product detail by id -------------------*/
    allProductDetails(id, pid, vid) {
        this.connectLoader = true;
        this.id = id;
        this.pid = pid;
        this.vid = vid;
        let fun;
        if (this.userData) {
            fun = this.user.getProductDetails(this.pid);
        } else {
            fun = this.user.getHomeProductDetails(this.pid);
        }
        fun.subscribe((productDetails) => {
            let response: any = productDetails;
            let data = [];
            // console.log(response);
            data = response.data;
            this.spinner.hide();
            this.product = response.data;
            this.reserve_stock = response.data.reserve_stock;
            this.product_category =
                this.product.master_product_category.product_category;
            this.changeSelected();
            this.connectLoader = false;

            if (this.product.attribute_values.length > 0) {
                this.product.attribute_values.forEach((element) => {
                    let tempArray: any;
                    if (!element.dataEntered && element.master_product_attribute) {
                        tempArray = {
                            attribute_name:
                                element.master_product_attribute.product_attribute,
                            attribute_value: [element.attribute_value],
                        };
                    }
                    element.dataEntered = true;
                    this.product.attribute_values.forEach((checker) => {
                        if (!checker.dataEntered) {
                            if (
                                element.master_product_attribute &&
                                checker.master_product_attribute
                            ) {
                                if (
                                    element.master_product_attribute.id ==
                                    checker.master_product_attribute.id
                                ) {
                                    tempArray.attribute_value.push(checker.attribute_value);
                                    checker.dataEntered = true;
                                }
                            }
                        }
                    });
                    !this.product.variant_attribute
                        ? (this.product.variant_attribute = [])
                        : void 0;
                    tempArray ? this.product.variant_attribute.push(tempArray) : void 0;
                });
            }

            if (this.product.product_variants.length > 0) {
                this.product.product_variants.forEach((variant) => {
                    if (variant.id == this.vid) {
                        this.youtubeUrl = variant.youtube_link;
                        if (variant.product_images.length > 0) {
                            this.variantSliderImage = variant;
                            this.variantSliderImageStatus = true;
                            let results = variant.product_images.filter((x, k) => {
                                if (x.is_feature === "yes") {
                                    return x.is_feature && x.product_variant_image_150x150;
                                }
                            });

                            if (results.length > 0) {
                                this.featuredImage = results[0].product_variant_image_500x500;
                                this.featuredFullImage = results[0].product_variant_image;
                            } else {
                                this.featuredImage =
                                    variant.product_images[0].product_variant_image_500x500;
                                this.featuredFullImage =
                                    variant.product_images[0].product_variant_image;
                            }
                        } else {
                            let result3 = this.default_image;
                            this.featuredImage = result3;
                            this.featuredFullImage = result3;
                            this.variantSliderImage = this.default_image;
                            this.variantSliderImageStatus = false;
                        }
                    }

                    if (variant.attribute_values.length > 0) {
                        variant.attribute_values.forEach((element) => {
                            let tempArray: any;
                            if (!element.dataEntered && element.master_product_attribute) {
                                tempArray = {
                                    attribute_name:
                                        element.master_product_attribute.product_attribute,
                                    attribute_value: [element.attribute_value],
                                };
                            }
                            element.dataEntered = true;
                            variant.attribute_values.forEach((checker) => {
                                if (!checker.dataEntered) {
                                    if (
                                        element.master_product_attribute &&
                                        checker.master_product_attribute
                                    ) {
                                        if (
                                            element.master_product_attribute.id ==
                                            checker.master_product_attribute.id
                                        ) {
                                            tempArray.attribute_value.push(checker.attribute_value);
                                            checker.dataEntered = true;
                                        }
                                    }
                                }
                            });
                            !variant.variant_attribute
                                ? (variant.variant_attribute = [])
                                : void 0;
                            tempArray ? variant.variant_attribute.push(tempArray) : void 0;
                        });
                    }

                    if (variant.id == this.vid) {
                        if (variant.variant_attribute && this.product.variant_attribute) {
                            this.att = variant.variant_attribute.concat(
                                this.product.variant_attribute
                            );
                        } else if (this.product.variant_attribute) {
                            this.att = this.product.variant_attribute;
                        } else if (variant.variant_attribute) {
                            this.att = variant.variant_attribute;
                        }
                        //  console.log(this.att);
                    }
                });
            }
        }, error => {
            // console.log(error);
            this.spinner.hide();
        });
    }

    /*--------------- slider images display when click on it ------------*/

    productDisplay(img, defaultImage) {
        this.connectLoader = true;
        this.youtubeUrlStatus = false;
        if (img) {
            this.featuredImage = img.product_variant_image_500x500;
            this.featuredFullImage = img.product_variant_image;
            this.connectLoader = false;
        }
    }

    productYoutubeDisplay(youtube_url) {
        this.connectLoader = true;
        if (youtube_url) {
            this.youtubeUrlStatus = true;
            this.youtubeUrl = youtube_url;
            this.connectLoader = false;
        } else {
            this.connectLoader = false;
        }
    }

    /*------------- select an option event for select product variant ------------*/

    changeFunc(e) {
        // console.log(e.target.value);
        this.vid = JSON.parse(e.target.value);
        this.changeSelected();
        this.router.navigate([
            "/categories/" +
            this.id +
            "/" +
            this.pid +
            "/" +
            JSON.parse(e.target.value),
        ]);
    }

    openDialogs(): any {
        this.userData= localStorage.getItem('userData');
     
        if(this.userData != null)
        {
          let userdatas=JSON.parse( this.userData);
         // console.log(userdatas.data.email_verification)
          this.emailverify=userdatas.data.email_verification
          this.validaccount=userdatas.data.valid_account;
         
  
        }
        if(this.emailverify !="verified")
        {
          
          const dailog = this.matDialog.open(KycComponent,{
            disableClose:true,
          });
          dailog.afterClosed().subscribe(result => {
            // console.log(`Dialog result: ${result}`);
          });
    
        }else
        {
          console.log("nooo")
          const dailog = this.matDialog.open(KycdilogformComponent,{
            disableClose:true,
          });
          dailog.afterClosed().subscribe(result => {
          //  console.log(`Dialog result: ${result}`);
          });
      
        }
          }

    onClickPreferredProductList(id, pid, vid) {
        this.allProductDetails(id, pid, vid);
        this.categoriesPreferredList();
        window.scrollTo(0, 0);
    }

    changeSelected() {
        this.product.product_variants.forEach((variant) => {
            // console.log("ee",variant.sku_code)
            if (variant.id == this.vid) {
                if (this.login_status) {
                    // this.getSampleProduct(variant.sku_code);
                }
               // console.log("ff",variant)
                variant.isSelected = true;
                this.variant_name = variant.variant_name;
                this.youtubeUrl = variant.youtube_link;
                this.minimum_order_quantity = variant.minimum_order_quantity;
                this.live_stock_dishpatch_time = variant.live_stock_dishpatch_time;
                this.ship_days = this.live_stock_dishpatch_time;
                this.minimum_quantity_of_reserve_stock =
                    variant.minimum_quantity_of_reserve_stock;
                this.reserve_stocks2 = variant.reserve_stock;
                this.reserve_stock_dishpatch_time =
                    variant.reserve_stock_dishpatch_time;
                this.available_qty = variant.quantity;
                this.moq_made_for_order=variant.moq_made_for_order
                this.moq_ready_stock=variant.moq_ready_stock
                this.selected = JSON.stringify(variant.id);
                // console.log(this.selected);
                if (variant.product_images.length > 0) {
                    let results = variant.product_images.filter((x, k) => {
                        if (x.is_feature === "yes") {
                            return x.is_feature && x.product_variant_image_150x150;
                        }
                    });

                    if (results.length > 0) {
                        this.featuredImage = results[0].product_variant_image_500x500;
                        this.featuredFullImage = results[0].product_variant_image;
                    } else {
                        this.featuredImage =
                            variant.product_images[0].product_variant_image_500x500;
                        this.featuredFullImage =
                            variant.product_images[0].product_variant_image;
                    }
                } else {
                    let result3 = this.default_image;
                    this.featuredImage = result3;
                    this.featuredFullImage = result3;
                }
                /*console.log(variant.catalogue_description);
                let specification_index = variant.catalogue_description.indexOf("<ul>");
                let specification_index1 =
                    variant.catalogue_description.indexOf("</ul>");
                let feature_index = variant.catalogue_description.lastIndexOf("<ul>");
                let feature_index1 = variant.catalogue_description.lastIndexOf("</ul>");
                console.log(variant.catalogue_description.lastIndexOf("<ul>"));
                console.log(variant.catalogue_description.lastIndexOf("</ul>"));
                let specification = variant.catalogue_description
                    .slice(specification_index + 4, specification_index1)
                    .replace(/<li>/gi, "")
                    .split("</li>");
                specification.pop();
                let specificationFilter = [];
                for (let i of specification) {
                    let data = i.split(":");
                    specificationFilter.push({ key: data[0], value: data[1] });
                }
                let feature = variant.catalogue_description
                    .slice(feature_index + 4, feature_index1)
                    .replace(/<li>/gi, "")
                    .split("</li>");
                feature.pop();
                console.log(feature);
                console.log(specificationFilter);
                variant.keySepcification = specificationFilter;
                variant.keyFeature = feature;
                */
            } else {
                variant.isSelected = false;
            }
        });
    }

    /*------------------ add to cart functionality --------------*/

    addToCart() {
        // console.log(this.available_qty);
        // console.log(this.reserve_stocks2);
        // console.log(this.reserve_stock_dishpatch_time);
        // console.log(this.minimum_quantity_of_reserve_stock);
        // console.log(this.currentVariant.lead_times.length);
        if (this.quantity < this.minimum_order_quantity) {
            this.toasterService.Error(
                "Quantity should not be less than of minimum order quantity."
            );
        } else if (this.minimum_order_quantity === 0) {
            this.toasterService.Error("Minimum order quantity is 0");
        } else if (
            this.quantity > this.available_qty &&
            this.quantity <= this.reserve_stocks2
        ) {
            let confirmation_msg;
            if (
                this.reserve_stock_dishpatch_time == 0 &&
                this.minimum_quantity_of_reserve_stock == 0
            ) {
                confirmation_msg =
                    "You are trying to order more than the Ready Stock. The new Dispatch Time and Minimum Order Quantity is not available at this moment";
            }

            if (
                this.reserve_stock_dishpatch_time == 0 &&
                this.minimum_quantity_of_reserve_stock > 0
            ) {
                confirmation_msg =
                    "You are trying to order more than the Ready Stock. The new Dispatch Time is not available at this moment and Minimum Order Quantity " +
                    this.minimum_quantity_of_reserve_stock +
                    " Units will be applicable.";
            }

            if (
                this.reserve_stock_dishpatch_time > 0 &&
                this.minimum_quantity_of_reserve_stock == 0
            ) {
                confirmation_msg =
                    "You are trying to order more than the Ready Stock. The new Dispatch Time " +
                    this.reserve_stock_dishpatch_time +
                    " Days and Minimum Order Quantity is not available at this moment.";
            }

            if (
                this.reserve_stock_dishpatch_time > 0 &&
                this.minimum_quantity_of_reserve_stock > 0
            ) {
                confirmation_msg =
                    "You are trying to order more than the Ready Stock. The new Dispatch Time " +
                    this.reserve_stock_dishpatch_time +
                    " Days and Minimum Order Quantity " +
                    this.minimum_quantity_of_reserve_stock +
                    " Units will be applicable.";
            }

            this.confirmationDialogHandlerService
                .openDialog({
                    question: confirmation_msg,
                    confirmText: "Accept",
                    cancelText: "Disagree",
                })
                .subscribe((result) => {
                    if (result) {
                        if (this.quantity >= this.minimum_quantity_of_reserve_stock) {
                            this.cartType = "add_cart";
                            this.is_sample = "no";
                            this.addToCartCommonFunction();
                        } else {
                            this.toasterService.Error(
                                "Quantity should not be less than of minimum order quantity of reserve stock."
                            );
                        }
                    }
                });
        } else if (this.quantity > this.available_qty) {
            if (this.currentVariant.lead_times.length > 0) {

                if (this.quantity > this.currentVariant.lead_times.at(-1).max_quantity) {
                    this.confirmationDialogHandlerService
                        .openDialog({
                            question:
                                "You have exceed limit of available quantity in Ready Stock and Made to Order Stock",
                            confirmText: "Ok",
                            cancelText: "Cancel",
                        })
                        .subscribe((result) => {
                            if (result) {
                            }
                        });
                }
                else {
                    this.cartType = "add_cart";
                    this.is_sample = "no";
                    this.addToCartCommonFunction();
                }
            } else {
                if (this.quantity > this.reserve_stocks2) {
                    this.confirmationDialogHandlerService
                        .openDialog({
                            question:
                                "You have exceed limit of available quantity in Ready Stock and Made to Order Stock",
                            confirmText: "Ok",
                            cancelText: "Cancel",
                        })
                        .subscribe((result) => {
                            if (result) {
                            }
                        });
                }

            }
        } else {
            this.cartType = "add_cart";
            this.is_sample = "no";
            this.addToCartCommonFunction();
        }
    }

    addToCartCommonFunction() {
        let variantToAdd = [];
        if (JSON.parse(localStorage.getItem("pendingOrderAmount"))) {
            localStorage.removeItem("pendingOrderAmount");
            localStorage.removeItem("paid_amount");
            localStorage.removeItem("pending_amount");
        }
        if (this.cartData && this.cartData.length > 0) {
            this.product.product_variants.forEach((element) => {
                console.log("ff",element)
                if (element.isSelected === true) {
                   
                    let flag = false;
                    this.cartData.forEach((data, index) => {
                        if (element.id == data.id && data.user_id == this.userData.id) {
                            flag = true;
                            this.cartData[index] = {
                                product_name: this.product.product_name,
                                variant_name: element.variant_name,
                                variant_image: this.getFeatureImg(element.product_images),
                                id: element.id,
                                quantity: this.quantity,
                                available_quantity: this.available_qty,
                                ready_stock: element.ready_stock,
                                reserve_stock_quantity: this.reserve_stocks2,
                                minimum_order_quantity: this.minimum_order_quantity,
                                minimum_quantity_of_reserve_stock:
                                    this.minimum_quantity_of_reserve_stock,
                                lead_times: element.lead_times,
                                base_price: element.base_price,
                                sale_price: this.customOfferPrice(element) || element.base_price,
                                hsn_code: element.hsn_code,
                                gst: element.gst,
                                cart_type: this.cartType,
                                is_sample: this.is_sample,
                                cid: this.id,
                                pid: this.pid,
                                vid: this.vid,
                                user_id: this.userData.id,
                                item_sku: element.sku_code,
                                product_status: "added",
                                is_branding: "no",
                                destinationPin: "",
                                MRP: element.max_retail_price,
                                display_dimension_with_packing:
                                    element.display_dimension_with_packing,
                                weight_with_packing: element.weight_with_packing,
                                deals: this.deals,
                                reserve_stock_dispatch_time:
                                    element.reserve_stock_dishpatch_time,
                                live_stock_dispatch_time: element.live_stock_dishpatch_time,
                                ship_days: this.ship_days,
                                view_flat_price: element.view_flat_price,
                                offer_prices: element.offer_prices,
                                moq_made_for_order:element.moq_made_for_order,
                                moq_ready_stock:element.moq_ready_stock
                            };
                            //  console.log(this.cartData[index]);
                        }
                    });
                    if (!flag) {
                        this.cartData.push({
                            product_name: this.product.product_name,
                            variant_name: element.variant_name,
                            variant_image: this.getFeatureImg(element.product_images),
                            id: element.id,
                            quantity: this.quantity,
                            available_quantity: this.available_qty,
                            ready_stock: element.ready_stock,
                            reserve_stock_quantity: this.reserve_stocks2,
                            minimum_order_quantity: this.minimum_order_quantity,
                            minimum_quantity_of_reserve_stock:
                                this.minimum_quantity_of_reserve_stock,
                            lead_times: element.lead_times,
                            base_price: element.base_price,
                            sale_price: this.customOfferPrice(element) || element.base_price,
                            gst: element.gst,
                            is_sample: this.is_sample,
                            cart_type: this.cartType,
                            cid: this.id,
                            pid: this.pid,
                            vid: this.vid,
                            user_id: this.userData.id,
                            item_sku: element.sku_code,
                            product_status: "added",
                            is_branding: "no",
                            destinationPin: "",
                            hsn_code: element.hsn_code,
                            MRP: element.max_retail_price,
                            display_dimension_with_packing:
                                element.display_dimension_with_packing,
                            weight_with_packing: element.weight_with_packing,
                            deals: this.deals,
                            reserve_stock_dispatch_time: element.reserve_stock_dishpatch_time,
                            live_stock_dispatch_time: element.live_stock_dishpatch_time,
                            ship_days: this.ship_days,
                            view_flat_price: element.view_flat_price,
                            offer_prices: element.offer_prices,
                            moq_ready_stock:this.moq_ready_stock,
                            moq_made_for_order:this.moq_made_for_order
                        });
                    }
                }
            });
            localStorage.setItem("cartData", JSON.stringify(this.cartData));
            // console.log(this.cartData);
        } else {
            this.product.product_variants.forEach((element) => {
                if (element.isSelected === true) {
                    variantToAdd.push({
                        product_name: this.product.product_name,
                        variant_name: element.variant_name,
                        variant_image: this.getFeatureImg(element.product_images),
                        id: element.id,
                        quantity: this.quantity,
                        available_quantity: this.available_qty,
                        ready_stock: element.ready_stock,
                        reserve_stock_quantity: this.reserve_stocks2,
                        minimum_order_quantity: this.minimum_order_quantity,
                        minimum_quantity_of_reserve_stock:
                            this.minimum_quantity_of_reserve_stock,
                        lead_times: element.lead_times,
                        base_price: element.base_price,
                        sale_price: this.customOfferPrice(element) || element.base_price,
                        gst: element.gst,
                        cart_type: this.cartType,
                        is_sample: this.is_sample,
                        cid: this.id,
                        pid: this.pid,
                        vid: this.vid,
                        user_id: this.userData.id,
                        item_sku: element.sku_code,
                        product_status: "added",
                        is_branding: "no",
                        hsn_code: element.hsn_code,
                        destinationPin: "",
                        MRP: element.max_retail_price,
                        display_dimension_with_packing:
                            element.display_dimension_with_packing,
                        weight_with_packing: element.weight_with_packing,
                        deals: this.deals,
                        reserve_stock_dispatch_time: element.reserve_stock_dishpatch_time,
                        live_stock_dispatch_time: element.live_stock_dishpatch_time,
                        ship_days: this.ship_days,
                        view_flat_price: element.view_flat_price,
                        offer_prices: element.offer_prices,
                        moq_made_for_order:element.moq_made_for_order,
                        moq_ready_stock:element.moq_ready_stock
                    });
                }
            });
            localStorage.setItem("cartData", JSON.stringify(variantToAdd));
            // console.log(variantToAdd);
        }

        if (this.product.branding_possibilities == "yes") {
            this.router.navigate([
                "/branding-selection/" + this.id + "/" + this.pid + "/" + this.vid,
            ]);
        } else {
            this.router.navigate(["/cart"]);
        }
    }

    getSample() {
        if (!this.quantity) {
            this.toasterService.Error("Quantity should not be empty.");
        } else if (this.quantity > 2) {
            this.toasterService.Error(
                "Quantity should be less than or equal to two."
            );
        } else {
            this.cartType = "get_sample";
            this.is_sample = "yes";
            this.addToCartCommonFunction();
        }
    }

    getFeatureImg(imgList) {
        let imgUrl = "";
        if (imgList.length > 0) {
            let results = imgList.filter((x, k) => {
                if (x.is_feature === "yes") {
                    return x.is_feature && x.product_variant_image_150x150;
                }
            });
            /*let result2 = imgList.filter((x,k) => {
              if(x.is_feature === "no"){
                return x.is_feature && x.product_variant_image_150x150;
              }
            });*/

            if (results.length > 0) {
                imgUrl = results[0].product_variant_image_500x500;
            } else {
                //imgUrl = result2[0].product_variant_image_500x500;
                imgUrl = imgList[0].product_variant_image_500x500;
            }
        } else {
            let result3 = this.default_image;
            imgUrl = result3;
        }
        return imgUrl;
    }

    categoriesPreferredList() {
        const preferred = {
            category_id: 1,
        };
        let offset = 0;
        let limit = 10;
        let fun;
        if (this.userData) {
            fun = this.user.categoriesPrefered(preferred, offset, limit);
        } else {
            fun = this.user.categoriesHomePrefered(preferred, offset, limit);
        }
        if (fun) {
            fun.subscribe((preferedProductList) => {
                let response: any = preferedProductList;
                let data = [];
                // console.log(response.data.rows);
                data = response.data.rows;
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i]["product_variants"].length; j++) {
                        this.tempProductListArr.push({
                            ids: data[i]["id"],
                            product_name: data[i]["product_name"],
                            product_variants: data[i]["product_variants"][j],
                        });
                    }
                }
                this.totalArrayLimit = this.tempProductListArr.length;

                for (var k = 0; k < this.arrayLimit; k++) {
                    if (this.tempProductListArr[k]) {
                        this.preferedProductList.push(this.tempProductListArr[k]);
                    }
                }
                this.currentLimit = this.preferedProductList.length;
            });
        }
    }
    increaseQuantity() {
        this.quantity++;
    }
    removeticket() {
        if (this.quantity - 1 == 0) return;
        this.quantity--;
    }

    modelChanged(val) {
        if (val === null) {
            this.quantity_status = false;
        } else if (val > 0) {
            this.quantity_status = true;
        } else {
            this.quantity_status = false;
            this.toasterService.Error("Please enter valid quantity");
        }

        if (
            this.quantity > this.available_qty &&
            this.quantity <= this.reserve_stocks2
        ) {
            if (
                this.reserve_stock_dishpatch_time > 0 &&
                this.minimum_quantity_of_reserve_stock == 0
            ) {
                this.ship_days = this.reserve_stock_dishpatch_time;
            }

            if (
                this.reserve_stock_dishpatch_time > 0 &&
                this.minimum_quantity_of_reserve_stock > 0
            ) {
                this.ship_days = this.reserve_stock_dishpatch_time;
            }
        } else if (this.quantity <= this.available_qty) {
            this.ship_days = this.live_stock_dishpatch_time;
        }
    }

    close() {
        this.dialogRef.close();
    }

    openLiveStock(data) {
        this.matDialog.open(LiveStockComponent, {
            data: data,
            panelClass: "cstm_dialog_panel",
        });
        this.getLiveStock(data);
    }

    openReserveStock(data, sku_code) {
        this.matDialog.open(ReserveStockComponent, {
            data:
                this.reserve_stocks2 +
                "=" +
                this.reserve_stock_dishpatch_time +
                "=" +
                sku_code +
                "=" +
                this.live_stock_dishpatch_time +
                "=" +
                this.minimum_quantity_of_reserve_stock +
                "=" +
                this.minimum_order_quantity,
            panelClass: "cstm_dialog_panel2",
        });
        this.getLiveStock(sku_code);
    }

    getLiveStock(sku) {
        this.user.getLiveStock(sku).subscribe((livestock) => {
            let response: any = livestock;
            if (response.data) {
                this.live_stock_qty = response.data[sku].quantity;
                this.available_qty = response.data[sku].quantity;
                // console.log(this.available_qty);
                //this.available_qty = response.data[sku].quantity + this.product.reserve_stock;
            } else {
                this.toasterService.Warning(response.message);
            }
        });
    }

    async submitDeliveryForm() {
        if (this.deliveryForm.invalid) return;
        const global = this;
        let formData = this.deliveryForm.value;
        let sku_code = this.currentVariant.sku_code;
        this.deliveryMsg = '';
        let maxtime
        if (global.currentVariant.lead_times.length > 1) {
            let index = global.currentVariant.lead_times.length - 1;
            maxtime = global.currentVariant.lead_times[index].max_quantity;
        } else {

            maxtime = global.currentVariant.lead_times[0].max_quantity;
        }



        if (global.currentVariant.lead_times.length > 0 && formData.unite >= global.currentVariant.ready_stock && formData.unite <= global.currentVariant.lead_times[0].min_quantity && formData.unite >= maxtime) {
            this.toasterService.Error("Please enter valid quantiy.Quantity range  must be between " + global.currentVariant.lead_times[0].min_quantity + "- " + maxtime + " and less or equal to ready stock");
            return;
        }

        if (global.currentVariant.lead_times.length > 0 && formData.unite > maxtime) {
            this.toasterService.Error("Please enter valid quantiy.Quantity should be " + global.currentVariant.lead_times[0].min_quantity + "- " + maxtime + " in between.")
            return;
        }

        if (global.currentVariant.lead_times.length == 0 && formData.unite > global.currentVariant.ready_stock) {
            this.toasterService.Error("please enter lesss than ready stock quantity.");
            return;
        }


        await this.user.getDeliveryETA(formData.pincode, formData.unite).subscribe(async (data) => {

            try {
                global.shipmentTiming = await data['data']['shipping_zone']['shipping_timings'][0];

            } catch (err) {
                global.deliveryMsg = 'Invalid Pincode';
                return;
            }

            // await global.user.getLiveStock(sku_code).subscribe(async (livestock) => {


            global.live_stock_inventory = global.currentVariant.ready_stock;
            let min_eta = global.shipmentTiming['min_ready_eta'];
            let max_eta = global.shipmentTiming['max_ready_eta'];
            // console.log("ee", max_eta);
            let diff_extra_qty = 0;
            let leadTime = {};
            if (formData.unite > global.live_stock_inventory) {
                diff_extra_qty = formData.unite - global.live_stock_inventory;
                leadTime = global.currentVariant.lead_times.find(ele => ele.min_quantity <= diff_extra_qty && ele.max_quantity >= diff_extra_qty);

                if (typeof leadTime === 'undefined') {
                    leadTime = { "min_eta": 0, "max_eta": 0 }
                }
                min_eta = min_eta + leadTime['min_eta'];
                max_eta = max_eta + leadTime['max_eta'];
            }

            global.deliveryMsg = `${min_eta}-${max_eta} days between ${moment().add(min_eta, 'days').format('DD MMM')} and ${moment().add(max_eta, 'days').format('DD MMM')}`;
            // });
        });




    }

    customOfferPrice(variant) {
        if (variant?.view_flat_price === 'yes') {
            return variant.base_price;
        } else {
            let qty = parseInt(this.quantity.toString());
            let offer_price = variant.offer_prices.find(rec => rec.min_quantity <= qty && rec.max_quantity >= qty);
            return offer_price?.offer_price || variant.base_price;
        }
    }

    get currentVariant() {
        return this.product.product_variants.find(ele => ele.isSelected);
    }
}
