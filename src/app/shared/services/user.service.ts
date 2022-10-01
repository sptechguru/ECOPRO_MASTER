import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

interface Extras {
  contentType: {
    isFormDataContent?: boolean;
    isJsonContent?: boolean;
  };
}

interface HttpResponseData {
  data?: any;
  message?: any;
  error?: any;
  success?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl =  environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  register(user) {
    return this.http.post(this.baseUrl+`/api/auth/signup?input=skip`,user);
  }

  // get Driver Profile
  getProductDetails(id){
    return this.http.get(this.baseUrl+`/api/reseller/get-product-details/${id}`);
  }

  getDeliveryETA(pincode, unite = null){
    return this.http.post(this.baseUrl+`/api/reseller/product-shipping-eta`, {
      pincode: pincode,
      unitq: unite
    });
  }

  getSampleProduct(id){
    return this.http.get(this.baseUrl+`/api/unicommerce/facility-inventory-stock/Warehouse/${id}`);
  }
  getHomeProductDetails(id){
    return this.http.get(this.baseUrl+`/api/home/get-product-details/${id}`);
  }

   // get Driver Profile
   getProductVariantDetails(id, vid){
    return this.http.get(this.baseUrl+`/api/reseller/get-product-variant-details/`+id+'/'+vid);
  }
  
  
  getProductCategoryDetails(id){
    return this.http.get(this.baseUrl+`/api/reseller/get-product-category-details/${id}`);
  }

  getHomeProductCategoryDetails(id){
    return this.http.get(this.baseUrl+`/api/home/get-product-category-details/${id}`);
  }

  categoriesPrefered(preferred,page,limit){
    return this.http.post(this.baseUrl+`/api/reseller/get-preferred-products?offset=`+(page || 0)+`&limit=`+(limit || 10), 
    preferred);
  }

  categoriesHomePrefered(preferred,page,limit){
    return this.http.post(this.baseUrl+`/api/home/get-preferred-products?offset=`+page+`&limit=`+limit, 
    preferred);
  }

  categoriesFilter(filter){
    return this.http.post(this.baseUrl+`/api/reseller/get-preferred-products?offset=0&limit=100`, filter);
  }

  categoriesList(){
    return this.http.get(this.baseUrl+`/api/reseller/get-product-category-list?offset=0&limit=100&category_type=parent`);
  }
  homeCategoriesList(){
    return this.http.get(this.baseUrl+`/api/home/get-product-category-list?offset=0&limit=100&category_type=parent`);
  }
  countryList(){
    return this.http.get(this.baseUrl+`/api/reseller/get-countries?offset=0&limit=100`);
  }
  stateList(id){
    return this.http.get(this.baseUrl+`/api/reseller/get-states?offset=0&limit=500`);
  }
  cityList(id){
    return this.http.get(this.baseUrl+`/api/reseller/get-cities?offset=0&limit=100&state_id=`+id);
  }
  createAddress(userid,data) {
    return this.http.post(this.baseUrl+`/api/reseller/create-user-address/`+userid,data);
  }

  createBillingAddress(userid,data) {
    return this.http.post(this.baseUrl+`/api/reseller/create-billing-address/`+userid,data);
  }
  getAddressList(id){
    return this.http.get(this.baseUrl+`/api/reseller/get-user-addresses/`+id);
  }

  createOrder(filter){
    return this.http.post(this.baseUrl+`/api/reseller/create-order`, filter);
  }

 /* manualPayment(order_id, filter){
    return this.http.post(this.baseUrl+`/api/reseller/make-manual-payment/`+order_id, filter);
  }*/

  manualPayment(url, reqBody, params?, extras?: Extras) {
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    reqBody = reqBody ? reqBody : {};
    return this.http.post<HttpResponseData>(url, reqBody, options).timeout(20000);
    // return this.http.post(url, reqBody, options).map(res => res as Order[] || []).timeout(20000);
  }

  getMyOrder(page, limit){
    return this.http.get(this.baseUrl+`/api/reseller/get-my-orders/?offset=`+page+`&limit=`+limit);
  }

  orderDetail(orderId){
    return this.http.get(this.baseUrl+`/api/reseller/get-my-order-details/`+orderId);
  }

  getFilteredProduct(filter, search_text, page, limit,sort='hstock'){
    if(search_text){
      return this.http.post(this.baseUrl+`/api/reseller/get-filtered-products?offset=`+page+`&limit=`+limit+`&search_text=`+search_text, filter);
    }else{  
      return this.http.post(this.baseUrl + `/api/reseller/get-filtered-product-variant?offset=`+page+`&limit=`+limit+`&sort_by=`+sort,filter);   
     // return this.http.post(this.baseUrl+`/api/reseller/get-filtered-products?offset=`+page+`&limit=`+limit+`&sort_by=`+sort, filter);
    }
  }

  getHomeFilteredProduct(filter, search_text, page, limit,sort='hstock'){
    if(search_text){
      return this.http.post(this.baseUrl+`/api/home/get-filtered-products?offset=`+page+`&limit=`+limit+`&search_text=`+search_text, filter);
    }else{
      //home/get-filtered-product-variant?offset=0&limit=20&sort_by=recent
      return this.http.post(this.baseUrl+`/api/home/get-filtered-product-variant?offset=`+page+`&limit=`+limit+`&sort_by=`+sort, filter);
    }
  }

  getFilteredProductByTag(filter, search_text, page, limit,sort='hstock'){
    if(search_text){
      return this.http.post(this.baseUrl+`/api/reseller/get-filtered-products-bytags?offset=`+page+`&limit=`+limit+`&search_text=`+search_text+`&sort_by=`+sort, filter);
    }else{
      return this.http.post(this.baseUrl+`/api/reseller/get-filtered-products-bytags?offset=`+page+`&limit=`+limit+`&sort_by=`+sort, filter);
    }
  }

  getMyOrderFilterbyStatus(order_status){
    return this.http.get(this.baseUrl+`/api/reseller/get-my-orders/?offset=0&limit=20&order_status=`+order_status);
  }

  getMyOrderFilterbyTrackingNumber(tracking_number){
    return this.http.get(this.baseUrl+`/api/reseller/get-my-orders/?offset=0&limit=20&tracking_number=`+tracking_number);
  }

  updateAddress(address_id,userid,data) {
    return this.http.post(this.baseUrl+`/api/reseller/update-user-address/`+userid+`/`+address_id, data);
  }

  getLiveStock(sku_code){
    return this.http.get(this.baseUrl+`/api/unicommerce/inventory-snapshot-for-live-stock/`+sku_code);
  }

  createOrderInstanceOnRazorpay(data){
    return this.http.post(this.baseUrl+`/api/reseller/create-order-instance-on-razorpay`, data);
  }

  verifyRazorpayPayments(data){
    return this.http.post(this.baseUrl+`/api/reseller/verify-razorpay-payments`, data);
  }

   // dhanraj_development


   getCatalogueList(page, limit){
    return this.http.get(this.baseUrl+`/api/reseller/get-catalogues/?offset=`+page+`&limit=`+limit);
  }

  updateCatalogue(id, data) {
    return this.http.post(this.baseUrl+`/api/reseller/update-catalogue/${id}` ,data );
  }

  deleteCatalogue(id , data){
    return this.http.post(this.baseUrl+`/api/reseller/delete-catalogue/${id}`, data);
  }

  deleteAddress(id , data){
    return this.http.post(this.baseUrl+`/api/reseller/delete-user-address/${id}`, data);
  }
  
  downloadCatalogue(catalogue_id){
    return this.http.get(this.baseUrl+`/api/reseller/download-catalogues/${catalogue_id}`);
  }
  
  getCatalogueProduct(catalogue_id){
    return this.http.get(this.baseUrl+`/api/reseller/get-catalogues-products/${catalogue_id}`)
  }

  addProductCatalogue(catalogue_id , body){
    return this.http.post(this.baseUrl+`/api/reseller/add-products-into-catalogue/${catalogue_id}`, body)
  }

  addSingleProductCatalogue(catalogue_id , variant_id,  body){
    return this.http.post(this.baseUrl+`/api/reseller/add-product-into-catalogue/`+catalogue_id+`/`+variant_id, 
    body)
  }

  removeAddCataProduct(catalogue_id, variant_id, data){
    return this.http.post(this.baseUrl+`/api/reseller/remove-product-from-catalogue/${catalogue_id}/${variant_id}`, data)
  }

  getServiceAbility(destinationPin){
    return this.http.get(this.baseUrl+`/api/reseller/get-serviceability?destinationPin=`+destinationPin)
  }

  priceCalculator(body){
    return this.http.post(this.baseUrl+`/api/reseller/pricecalculator`, body)
  }

  getSearchProduct(filter, search_text, page, limit){
    return this.http.post(this.baseUrl+`/api/reseller/search-products?offset=`+page+`&limit=`+limit+`&search_text=`+search_text, filter);
  }

  getSearchProduct2(filter, search_text, page, limit){
    return this.http.get(this.baseUrl+`/api/reseller/search-product-tags?offset=`+page+`&limit=`+limit+`&search_text=`+search_text, filter);
  }

  getTrandingSearchProduct(){
    return this.http.get(this.baseUrl+`/api/reseller/trending-search-product-tags-list`);
  }

  headerCategoriesList(offset, limit){
    return this.http.get(this.baseUrl+`/api/reseller/get-product-category-list?offset=`+offset+`&limit=`+limit+`&category_type=parent`);
  }

  addMarginIntoCatalogueProduct(body){
    /*let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    reqBody = reqBody ? reqBody : {};
    return this.http.post<HttpResponseData>(this.baseUrl+`/api/reseller/add-margin-into-catalogue-variants`, reqBody, options).timeout(20000);*/
    return this.http.post(this.baseUrl+`/api/reseller/add-margin-into-catalogue-variants`, body);
  }

  private renderHeaders(extras: Extras) {
    // if extras is present then apply check
    if (extras) {
      if (extras.contentType.isFormDataContent) {
        return {};
      }
    } else {
      // else assume it to be json data
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Expires': '-1',
          'Pragma': 'no-cache',
        })
      };
    }
  }

  private appendParams(originalOptions, paramsObj) {
    let params = new HttpParams();
    for (const key in paramsObj) {
      if (paramsObj.hasOwnProperty(key)) {
        params = params.append(key, paramsObj[key]);
      }
    }
    return Object.assign({}, originalOptions, { params: params });
  }


}
