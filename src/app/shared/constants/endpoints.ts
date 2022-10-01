import { environment } from "environments/environment";



environment
class Endpoints {
    baseUrl: string = environment.baseUrl;
    VIDEO_URL: string = this.baseUrl + '/server_images/ekmatra-video.mp4';
    AUTH_BASE = this.baseUrl + '/api/auth';
    USER_BASE = this.baseUrl + '/api/users';
    ADMIN_BASE = this.baseUrl + '/api/admin';
    BUISNESS_BASE = this.baseUrl + '/api/reseller';
    MISCELLANEOUS_BASE = this.baseUrl + '/api';
    UPLOADED_RESOURCES_BASE = this.baseUrl + '/uploads/';
    UPLOADED_THUMB_RESOURCES_BASE = this.UPLOADED_RESOURCES_BASE + 'thumb/';

    AUTH_ENDPOINTS = {
        LOGIN_IN: this.joinPaths(this.AUTH_BASE, 'login'),
        OTPLOGIN_IN: this.joinPaths(this.AUTH_BASE, 'otp/login'),
        VERIFY_OTP: this.joinPaths(this.AUTH_BASE, 'verify-otp-login'),
        VERIFY_PHONE: this.joinPaths(this.AUTH_BASE, 'verify-phone'),
        SIGN_UP: this.joinPaths(this.AUTH_BASE, 'signup'),
        SUBSCRIPTION_LIST: this.joinPaths(this.AUTH_BASE, 'get-subscription-packages'),
        FORGET_PASSWORD: this.joinPaths(this.AUTH_BASE, 'forgot-password'),
        RESET_PASSWORD: this.joinPaths(this.AUTH_BASE, 'reset-password'),
        VERIFY_EMAIL: this.joinPaths(this.AUTH_BASE, 'verify-email'),
        RESEND_EMAIL: this.joinPaths(this.AUTH_BASE, 'resend-verification'),
        CHANGE_PASSWORD: this.joinPaths(this.AUTH_BASE, 'change-password'),
        LOGOUT: this.joinPaths(this.AUTH_BASE, 'logout'),
        API: this.joinPaths(this.USER_BASE, 'get-app-version'),  
        Otp_Register: this.joinPaths(this.AUTH_BASE, 'otp/register'),  
        UPDATE_PROFILE: this.joinPaths(this.USER_BASE, 'update-profile'),
        Request_Call_Back: this.joinPaths(this.AUTH_BASE, 'request_call_back') , 
        OTP_SIGNUP: this.joinPaths(this.AUTH_BASE, 'otp/signup'), 
        VERIFY_OTP_LOGIN: this.joinPaths(this.AUTH_BASE, 'verify-otp-login'),  
        USER_DETAILS_UPDATE: this.joinPaths(this.AUTH_BASE, 'user-details-update'),
        OTP_EMAIL_REGISTER: this.joinPaths(this.AUTH_BASE, 'otp/email-register'),
        OTP_VERIFY_EMAIL: this.joinPaths(this.AUTH_BASE, 'verify-email'),  
    };

    QUEST_ENDPOINTS = {
        ROAD_BLOCK_BANNER_IMAGE: this.joinPaths(this.BUISNESS_BASE, 'get-road-block-banner'),
        HELP_AND_SUPPORT_FORM: this.joinPaths(this.BUISNESS_BASE, 'help-and-support'),
        FEEDBACK_AND_SUPPORT_FORM: this.joinPaths(this.BUISNESS_BASE, 'create-feedback'),
        BUISNESS_CLIENT: this.joinPaths(this.BUISNESS_BASE, 'get-business-clients'),
        BUISNESS_PARTNERS: this.joinPaths(this.BUISNESS_BASE, 'get-business-partners'),
        BUISNESS_TYPES: this.joinPaths(this.BUISNESS_BASE, 'get-business-types'),
        BUISNESS_CATEGORIES: this.joinPaths(this.BUISNESS_BASE, 'get-product-categories'),
        SAVE_QUISTIONSRIES: this.joinPaths(this.BUISNESS_BASE, 'save-questionnaire'),
        UPLOAD_PERSONALKYC:  this.joinPaths(this.BUISNESS_BASE, 'update-personal-kyc'),
        UPLOAD_BUISNESSKYC: this.joinPaths(this.BUISNESS_BASE, 'update-business-kyc'),
        GET_KYC_DETAILS :  this.joinPaths(this.BUISNESS_BASE, 'get-kyc-details'),
        GET_QUISTIONSRIES: this.joinPaths(this.BUISNESS_BASE, 'get-questionnaire-details'),
        GET_COUNTRY: this.joinPaths(this.BUISNESS_BASE, 'get-countries'),
        GET_STATE: this.joinPaths(this.BUISNESS_BASE, 'get-states'),
        GET_CITY: this.joinPaths(this.BUISNESS_BASE, 'get-cities'),
        CATEGORIES_LIST: this.joinPaths(this.BUISNESS_BASE, 'get-product-category-list'),
        PRODUCTS_DETAILS: id => this.joinPaths(this.BUISNESS_BASE,`get-product-category-details/${id}`) ,
        PREFERED_PRODUCT: this.joinPaths(this.BUISNESS_BASE, 'get-preferred-products'),
        // catalogue
        CREATE_CATALOGUE: this.joinPaths(this.BUISNESS_BASE, 'create-catalogue'),
        GET_FILTRED_PRODUCTS: this.joinPaths(this.BUISNESS_BASE, 'get-filtered-products'),

        UPDATE_CATALOGUE: id => this.joinPaths(this.BUISNESS_BASE, `update-catalogue`, id),
        DOWNLOADCATALOG: (catalogue_id) => this.joinPaths(this.BUISNESS_BASE, 'download-catalogues',catalogue_id),
        //request to call quotes
        CREATE_REQUESTWITHQUOTES: this.joinPaths(this.BUISNESS_BASE, 'request-with-quote-to-assigned-manager'),
        GETBUISNESSPROFILE: this.joinPaths(this.BUISNESS_BASE, 'get-business-profile'),
        UPDATEBUISNESSPROFILE: (id: any) => this.joinPaths(this.BUISNESS_BASE, `update-business-profile/${id}`),
        GETUSERADDRESS: (user_id: any) => this.joinPaths(this.BUISNESS_BASE, `get-user-addresses/${user_id}`),
        CREATEUSERADDRESS: (user_id: any) => this.joinPaths(this.BUISNESS_BASE, `create-user-address/${user_id}`),
        UPDATEUSERADDRESS: (user_id: any, id: any) => this.joinPaths(this.BUISNESS_BASE, `update-user-address/${user_id}/${id}`),
        DELETEUSERADDRESS: (id: any) => this.joinPaths(this.BUISNESS_BASE , `delete-user-address/${id}` ),
        LanguagePREFFRENCE: (language: any) => this.joinPaths(this.BUISNESS_BASE , `language-preference/${language}` ),
        ADD_PRODUCT_INTO_CATA: (catalogue_id: any , variant_id: any) => this.joinPaths(this.BUISNESS_BASE ,
            `add-product-into-catalogue/${catalogue_id}/${variant_id}`),
        GET_CATALOGUE_DETAILS: (catalogue_id: any) => this.joinPaths(this.BUISNESS_BASE,`get-catalogues-products/${catalogue_id}`),
        GET_BUSINESS_PROFILE: this.joinPaths(this.BUISNESS_BASE, 'get-business-profile'),
        UPDATE_BUSINESS_PROFILE: this.joinPaths(this.BUISNESS_BASE, 'update-business-profile'),
    };

    USER_ENDPONTS = {
        CHANGE_PASSWORD: this.joinPaths(this.USER_BASE, 'change-password'),
        LOGOUT: this.joinPaths(this.USER_BASE, 'logout'),
        MY_DETAILS: this.joinPaths(this.USER_BASE, 'my-details'),
        Business_Profile: this.joinPaths(this.USER_BASE, 'upload-company-logo'),
        Update_Business_Profile: this.joinPaths(this.USER_BASE, 'update-business-profile'),
        GET_PROFILE: this.joinPaths(this.USER_BASE, 'my-details'),
        UPDATE_USER_PROFILE: this.joinPaths(this.USER_BASE, 'update-user-profile'),
    };
    MISCELLANEOUS_ENDPOINTS = {
        GET_COUNTRY_LIST: this.joinPaths(this.MISCELLANEOUS_BASE, 'country'),
        GET_STATE_LIST: this.joinPaths(this.MISCELLANEOUS_BASE, 'state')
    };
    ADMIN_USER_ENDPOINTS = {
        GET_USER_LIST: this.joinPaths(this.ADMIN_BASE, 'user'),
        USER_STATUS_UPDATE_URL: (status, id) => this.joinPaths(this.ADMIN_BASE, 'change-user-status', status, id),
        GET_ALL_USER_LIST: this.joinPaths(this.ADMIN_BASE, 'get-all-users-list'),
        ADD_USER: this.joinPaths(this.ADMIN_BASE, 'user'),
        USER_DETAIL: id => this.joinPaths(this.ADMIN_BASE, 'get-user-details', id),
        UPDATE_USER: id => this.joinPaths(this.ADMIN_BASE, 'save-user', id),
        USER_LABOUR_WAGES_URL: this.joinPaths(this.ADMIN_BASE, 'save-labour-wages'),
        USER_USER_ACCOUNT_URL: this.joinPaths(this.ADMIN_BASE, 'add-user-account'),
        DELETE_USER: id => this.joinPaths(this.ADMIN_BASE, id),
        CHANGE_USER_PASSWORD: id => this.joinPaths(this.ADMIN_BASE, id, 'change-password'),
        GET_USER_ACCOUNT_LIST: this.joinPaths(this.ADMIN_BASE, 'get-user-account-list')
    };
    CONTACT_US = {
        CONTACT_US: this.joinPaths(this.AUTH_BASE, 'contact-us'),
    };

    DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS = {
        DEFAULT_IMAGE: 'assets/images/imgpsh_fullsize_anim.png',
    };

    PAYMENT = {
        PAYMENT_API: this.joinPaths(this.BUISNESS_BASE, 'make-manual-payment'),
        RAZORPAY_ORDER_CREATE: this.joinPaths(this.BUISNESS_BASE, 'create-order-instance-on-razorpay'),
    };

    SLIDER = {
        SLIDER_FILES: this.joinPaths(this.BUISNESS_BASE, 'get-slidebar-files'),
        IMAGEBAR_FILES: this.joinPaths(this.BUISNESS_BASE, 'get-imagebar-files'),
    };

    DEALS = {
        DEALS_NAME: this.joinPaths(this.BUISNESS_BASE, 'get-deals-name'),
        DEALS_PRODUCT: this.joinPaths(this.BUISNESS_BASE, 'get-deals-products'),
        DEALS_PRODUCT_BY_ID: this.joinPaths(this.BUISNESS_BASE, 'get-deal-products'),
        PRODUCT_VARIANT_DETAIL: this.joinPaths(this.BUISNESS_BASE, 'get-product-variant-details'),
    };
 COLLECTION={
     COLLECTION_LIST:this.joinPaths(this.baseUrl, '/api/home/get-collections'),
 }
    

    private joinPaths(...params) {
        const newUrl = params.join('/');
        return newUrl;
    }
}
export const API = new Endpoints();
