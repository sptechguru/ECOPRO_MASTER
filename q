[1mdiff --git a/src/app/front/search-deals-product/search-deals-product.component.ts b/src/app/front/search-deals-product/search-deals-product.component.ts[m
[1mindex a8d1afe..f8ebef3 100644[m
[1m--- a/src/app/front/search-deals-product/search-deals-product.component.ts[m
[1m+++ b/src/app/front/search-deals-product/search-deals-product.component.ts[m
[36m@@ -24,6 +24,9 @@[m [mexport class SearchDealsProductComponent implements OnInit {[m
   collectionStatus=false;[m
   collectionList=[];[m
   recordsSortBy: string = 'recent';[m
[32m+[m[32m  kycdata:any;[m
[32m+[m[32m  gstno:any;[m
[32m+[m[32m  gststatus:any;[m
 [m
   constructor(private _route: ActivatedRoute, private _api: ApiHandlerService, [m
     private toasterService: ToasterService, private route: Router) { }[m
[36m@@ -39,6 +42,15 @@[m [mexport class SearchDealsProductComponent implements OnInit {[m
       this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;[m
       this.getDealsProductById(this.deals_id);[m
     }[m
[32m+[m[32m    this.kycdata=localStorage.getItem('kyc');[m
[32m+[m[32m    // console.log(this.kycdata)[m
[32m+[m[32m     if( this.kycdata !=null)[m
[32m+[m[32m     {[m[41m  [m
[32m+[m[32m       let newkycdd=JSON.parse(this.kycdata);[m[41m   [m
[32m+[m[32m       this.gstno=newkycdd.gst_no;[m
[32m+[m[32m       this.gststatus=newkycdd.gst_status;[m
[32m+[m[32m       console.log(this.gststatus)[m
[32m+[m[32m     }[m
   }[m
 [m
   getCollection(){[m
