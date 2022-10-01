import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  id;
  index=0;
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
  live_stock_inventory: number = 0;
  productDetails: any = { data: {} };
  product: any = [];
  cartType: any;
  constructor(private activeRoute:ActivatedRoute,private user: UserService,private toasterService: ToasterService) { 

  }

  ngOnInit(): void {
    this.id=this.activeRoute.snapshot.paramMap.get('id');
    //console.log(this.id);
    if(this.id){
      this.getProductDetails();
    }
  }
  getProductDetails(){
    this.user.getProductDetails(this.id).subscribe((res:any)=>{
      if(res){
        console.log(res);
        let response: any = res;
        let data = [];
        console.log(response);
        data = res.data;
        this.product = response.data;
        this.reserve_stock = response.data.reserve_stock;
        console.log(this.product);
        this.product_category = this.product.master_product_category.product_category;
        this.changeSelected();
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
        let index=0;
          this.product.product_variants.forEach((variant) => {
              if (index == this.index) {
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

              if (index==this.index) {
                  if (variant.variant_attribute && this.product.variant_attribute) {
                      this.att = variant.variant_attribute.concat(
                          this.product.variant_attribute
                      );
                  } else if (this.product.variant_attribute) {
                      this.att = this.product.variant_attribute;
                  } else if (variant.variant_attribute) {
                      this.att = variant.variant_attribute;
                  }
                  console.log(this.att);
              }
              index++;
          });
       }
      }
    },
    error =>{
      console.log(error);
    })
  }
  productDisplay(img, defaultImage) {
    this.connectLoader = true;
    this.youtubeUrlStatus = false;
    if (img) {
        this.featuredImage = img.product_variant_image_500x500;
        this.featuredFullImage = img.product_variant_image;
        this.connectLoader = false;
    }
}
increaseQuantity() {
  this.quantity++;
}
removeticket() {
  if (this.quantity - 1 == 0) return;
  this.quantity--;
}
changeFunc(e) {
  console.log(e.target.value);
  for(let i=0;i<this.product.product_variants.length;i++){
    if(this.product.product_variants[i].id==e.target.value){
        this.index=i;
        break;
    }
  }
  //this.changeSelected();
  this.getProductDetails();
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

  changeSelected() {
    for(let i=0;i<this.product.product_variants.length;i++){
      
      if(i==this.index){
        this.product.product_variants[i].isSelected = true;
            this.variant_name = this.product.product_variants[i].variant_name;
            console.log(this.variant_name);
            this.youtubeUrl = this.product.product_variants[i].youtube_link;
            this.minimum_order_quantity = this.product.product_variants[i].minimum_order_quantity;
            this.live_stock_dishpatch_time = this.product.product_variants[i].live_stock_dishpatch_time;
            this.ship_days = this.live_stock_dishpatch_time;
            this.minimum_quantity_of_reserve_stock =
            this.product.product_variants[i].minimum_quantity_of_reserve_stock;
            this.reserve_stocks2 = this.product.product_variants[i].reserve_stock;
            this.reserve_stock_dishpatch_time =
            this.product.product_variants[i].reserve_stock_dishpatch_time;
            this.available_qty = this.product.product_variants[i].quantity;
            this.selected = this.product.product_variants[i].id;
            console.log(this.selected);
            if (this.product.product_variants[i].product_images.length > 0) {
                let results = this.product.product_variants[i].product_images.filter((x, k) => {
                    if (x.is_feature === "yes") {
                        return x.is_feature && x.product_variant_image_150x150;
                    }
                });

                if (results.length > 0) {
                    this.featuredImage = results[0].product_variant_image_500x500;
                    this.featuredFullImage = results[0].product_variant_image;
                } else {
                    this.featuredImage =
                    this.product.product_variants[i].product_images[0].product_variant_image_500x500;
                    this.featuredFullImage =
                    this.product.product_variants[i].product_images[0].product_variant_image;
                }
            } else {
                let result3 = this.default_image;
                this.featuredImage = result3;
                this.featuredFullImage = result3;
            }
            console.log(this.product.product_variants[i].catalogue_description);
            let specification_index = this.product.product_variants[i].catalogue_description.indexOf("<ul>");
            let specification_index1 =
            this.product.product_variants[i].catalogue_description.indexOf("</ul>");
            let feature_index = this.product.product_variants[i].catalogue_description.lastIndexOf("<ul>");
            let feature_index1 = this.product.product_variants[i].catalogue_description.lastIndexOf("</ul>");
            console.log(this.product.product_variants[i].catalogue_description.lastIndexOf("<ul>"));
            console.log(this.product.product_variants[i].catalogue_description.lastIndexOf("</ul>"));
            let specification = this.product.product_variants[i].catalogue_description
                .slice(specification_index + 4, specification_index1)
                .replace(/<li>/gi, "")
                .split("</li>");
            specification.pop();
            let specificationFilter = [];
            for (let i of specification) {
                let data = i.split(":");
                specificationFilter.push({ key: data[0], value: data[1] });
            }
            let feature = this.product.product_variants[i].catalogue_description
                .slice(feature_index + 4, feature_index1)
                .replace(/<li>/gi, "")
                .split("</li>");
            feature.pop();
            console.log(feature);
            console.log(specificationFilter);
            this.product.product_variants[i].keySepcification = specificationFilter;
            this.product.product_variants[i].keyFeature = feature;
      }
      else{
        this.product.product_variants[i].isSelected = false;
      }
    }
    
}

}
