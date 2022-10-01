import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { map} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray , FormControl, Validators, AbstractControl} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from 'app/shared/services/toaster.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subject } from "rxjs/Subject";
import { take, takeUntil } from "rxjs/operators";
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})

export class QuestionsComponent implements OnInit {
 public  buisnessClient: any
 public  buisnessPart: any
 public  productCategories: any 
 public  buisnessType: any
 id = []
 items: any;
 partners: any;
 products: any;
 types: any;
 isProcessing = false;
 questionForm: FormGroup;
 StateList: any;
 CityList: any;
 businessTypeID: any;
 businessCategoryID: any;
 businessSectorID: Array<any> = [];
 productCategoryID: Array<any> = [];
 turnOverVal: any;
 teamSizeVal: any;
 turnOver: any = [
   {value: 'Less than 1cr', label: 'Less than 1 Cr'},
   {value: '1cr - 5cr', label: '1 - 5 Cr'},
   {value: '5cr - 10cr', label: '5 - 10 Cr'},
   {value: '10+ cr', label: '10 + Cr'}
 ];
 /*teamSize: any = [ 
    {value: '1 – 10', label: '1 – 10'},
    {value: '11 – 25', label: '11 – 25'},
    {value: '26 – 50', label: '26 – 50'},
    {value: '50 – 100', label: '50 – 100'}
 ];*/
 questionSlider = {
    
  "nextArrow": "<div class='nav-btn slide-btn-rounded next-slide'><span class='material-icons'>east</span> </div>",
  "prevArrow": "<div class='nav-btn slide-btn-rounded prev-slide'><span class='material-icons'>west</span></div>",
  "dots": false,
  "arrow": true,
  "speed": 300,
  "autoplay": false,
  "autoplaySpeed": 2000,
  "infinite": false,
  "slidesToShow": 6,
  "slidesToScroll": 1,
  "touchMove": true,
  "draggable": true,
  // "centerMode": true,
  // "centerPadding": '120px',
  
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
 
  public state: FormControl = new FormControl();

  public stateFilterCtrl: FormControl = new FormControl();


  public filteredStates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public city: FormControl = new FormControl();

  public cityFilterCtrl: FormControl = new FormControl();


  public filteredCities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild("singleSelect") singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();
  
  constructor(private _route : ActivatedRoute,
    private _api : ApiHandlerService,
    private fb: FormBuilder ,
    public translate: TranslateService,
    public localStorage: StorageAccessorService,
    private toasterService: ToasterService,
    private router: Router,) { }


  ngOnInit(): void {
    this.buisnessClientList();
    this.buisnessPartners();
    this.buisnessTypes();
    this.buisnessCategoris();
    this.getStateList();
    this.createForm();
  }

  // business sector

  buisnessClientList(){
    this._api.apiGet(API.QUEST_ENDPOINTS.BUISNESS_CLIENT+'?offset=0&limit=200').subscribe(
      (Response:any)=>{  
        this.buisnessClient = Response.data.rows;
        let items = [];
        this.buisnessClient.forEach((value, index) => {
          if(value.business_client == 'Client'){
            value["image"] = 'assets/images/Client.png';
          }else if(value.business_client == 'Pharmacy'){
            value["image"] = 'assets/images/Pharmacy.png';
          }else if(value.business_client == 'Wellnesss'){
            value["image"] = 'assets/images/Wellness.png';
          }else if(value.business_client == 'Wellness / Fitness / Sports / Beauty'){
            value["image"] = 'assets/images/Wellness-Sport-Beauty.png';
          }else if(value.business_client == 'Textiles / Garments / Accessories'){
            value["image"] = 'assets/images/Textiles.png';
          }else if(value.business_client == 'Telecom / ISP'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Pharma / Biotech / Clinical Research'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Oil and Gas / Energy / Power / Infrastructure'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Office Equipment / Automation'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'NGO / Social Services / Regulators / Industry Associations'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Medical / Healthcare / Hospitals'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Media / Entertainment / Internet'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Gems / Jewellery'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Education / Teaching / Training'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Courier / Transportation / Freight / Warehousing'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Consumer Electronics / Appliances / Durables'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Construction / Engineering / Cement / Metals'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Chemicals / PetroChemical / Plastic / Rubber'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Brewery / Distillery'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Banking / Financial Services / Broking / Insurance'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Architecture / Interior Design'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Advertising / PR / MR / Event Management'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Accounting / Finance'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'Automobile / Auto Anciliary / Auto Components'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_client == 'IT-Software / Software Services'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_partner != 'Client' 
          && value.business_partner != 'Pharmacy'
          && value.business_partner != 'Wellnesss'
          && value.business_partner != 'Wellness / Fitness / Sports / Beauty'
          && value.business_partner != 'Textiles / Garments / Accessories'
          && value.business_partner != 'Telecom / ISP'
          && value.business_partner != 'Pharma / Biotech / Clinical Research'
          && value.business_partner != 'Oil and Gas / Energy / Power / Infrastructure'
          && value.business_partner != 'Office Equipment / Automation'
          && value.business_partner != 'NGO / Social Services / Regulators / Industry Associations'
          && value.business_partner != 'Medical / Healthcare / Hospitals'
          && value.business_partner != 'Media / Entertainment / Internet'
          && value.business_partner != 'Gems / Jewellery'
          && value.business_partner != 'Education / Teaching / Training'
          && value.business_partner != 'Courier / Transportation / Freight / Warehousing'
          && value.business_partner != 'Consumer Electronics / Appliances / Durables'
          && value.business_partner != 'Construction / Engineering / Cement / Metals'
          && value.business_partner != 'Chemicals / PetroChemical / Plastic / Rubber'
          && value.business_partner != 'Brewery / Distillery'
          && value.business_partner != 'Banking / Financial Services / Broking / Insurance'
          && value.business_partner != 'Architecture / Interior Design'
          && value.business_partner != 'Advertising / PR / MR / Event Management'
          && value.business_partner != 'Accounting / Finance'
          && value.business_partner != 'Automobile / Auto Anciliary / Auto Components'
          && value.business_partner != 'IT-Software / Software Services'
          ){
            value["image"] = 'assets/images/default_icon.png';
          }
          items.push(value);
        });
        this.items = items;
      },
    )
  }
  
  buisnessPartners(){
    this._api.apiGet(API.QUEST_ENDPOINTS.BUISNESS_PARTNERS+'?offset=0&limit=200').subscribe(
      (Response: any)=>{
        this.buisnessPart = Response.data.rows;
        let partners = [];
        this.buisnessPart.forEach((value, index) => {
          if(value.business_partner == 'Partner'){
            value["image"] = 'assets/images/Client.png';
          }else if(value.business_partner == 'Corporate Supplier'){
            value["image"] = 'assets/images/Pharmacy.png';
          }else if(value.business_partner == 'Gifting partner'){
            value["image"] = 'assets/images/Wellness.png';
          }else if(value.business_partner != 'Partner' && value.business_partner != 'Corporate Supplier'
          && value.business_partner != 'Gifting partner'){
            value["image"] = 'assets/images/default_icon.png';
          }
          partners.push(value);
        });
        this.partners = partners;
      },
    )
  }

  buisnessTypes(){
    this._api.apiGet(API.QUEST_ENDPOINTS.BUISNESS_TYPES+'?offset=0&limit=200').subscribe(
      (Response: any )=>{
        this.buisnessType = Response.data.rows;
        let types = [];
        this.buisnessType.forEach((value, index) => {
          if(value.business_type == 'Incorporations'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_type == 'HUF'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_type == 'Limited Liability Partnership'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_type == 'Public Limited'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_type == 'Private Limited'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_type == 'Sole Proprietorship'){
            value["image"] = 'assets/images/default_icon.png';
          }else if(value.business_type != 'Incorporations' && value.business_type != 'HUF'
          && value.business_type != 'Limited Liability Partnership'
          && value.business_type != 'Public Limited'
          && value.business_type != 'Private Limited'
          && value.business_type != 'Sole Proprietorship'){
            value["image"] = 'default_icon.png';
          }
          types.push(value);
        });
        this.types = types;
      },
    )
  }

  buisnessCategoris(){
    this._api.apiGet(API.QUEST_ENDPOINTS.BUISNESS_CATEGORIES+'?offset=0&limit=200').subscribe(
      (Response : any)=>{
        this.productCategories = Response.data.rows;
        this.products = this.productCategories;
      },
    )
  }

  getStateList(){
    this._api.apiGet(API.QUEST_ENDPOINTS.GET_STATE+'?offset=0&limit=200').subscribe(
      (Response : any)=>{
        this.StateList = Response.data.rows;
        this.filteredStates.next(this.StateList.slice());

        this.stateFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterStates();
          });
      },
    )
  }

  private filterStates() {
    if (!this.StateList) {
      return;
    }
    let search = this.stateFilterCtrl.value;
    if (!search) {
      this.filteredStates.next(this.StateList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStates.next(
      this.StateList.filter(
        states => states.state.toLowerCase().indexOf(search) > -1
      )
    );
  }

  selectState(e){
    let value = e.value.split(',');
    let name = value[0];
    let id = value[1];
    this.getCityList(id);
  }

  getCityList(state_id){
    this._api.apiGet(API.QUEST_ENDPOINTS.GET_CITY+'?offset=0&limit=200&state_id='+state_id).subscribe(
      (Response : any)=>{
        this.CityList = Response.data.rows;
        this.filteredCities.next(this.CityList.slice());

        this.cityFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCities();
          });
      },
    )
  }

  private filterCities() {
    if (!this.CityList) {
      return;
    }
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCities.next(this.CityList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCities.next(
      this.CityList.filter(
        cities => cities.city.toLowerCase().indexOf(search) > -1
      )
    );
  }

  createForm(){
    this.questionForm = this.fb.group({
      business_client: ["", [Validators.required]],
      business_type: ["", [Validators.required]],
      product_category: ["", [Validators.required]],
      business_partner: ["", [Validators.required]],
      turnover: ["", [Validators.required]],
      team_size: ["", [Validators.required]]
    });
  }

  onChangeType(e, val){
    this.businessTypeID = val.id;
  }

  onChangeBusinessCategory(e, val){
    this.businessCategoryID = val.id;
  }

  onChangeBusinessSector(e, val){
    if(e.checked){
      this.businessSectorID.push(val.id);  
    }else{
      var whatIndex = null;
      this.businessSectorID.forEach(function(value, index){
        if(value === val.id){
          whatIndex = index;
        }
      });
      this.businessSectorID.splice(whatIndex, 1);
    }
  }

  onChangeProduct(e, val){
    if(e.checked){
      this.productCategoryID.push(val.id);  
    }else{
      var whatIndex = null;
      this.productCategoryID.forEach(function(value, index){
        if(value === val.id){
          whatIndex = index;
        }
      });
      this.productCategoryID.splice(whatIndex, 1);
    }
  }

  onChangeTurnOver(e, val){
    this.turnOverVal = val.value;
  }

  handleSubmit(){
    if (this.turnOverVal && this.productCategoryID.length>0
      && this.businessSectorID.length>0 && this.businessCategoryID
      && this.businessTypeID) {
      this.isProcessing = true;
      let data = {
        business_client: this.businessSectorID,
        business_type: this.businessTypeID,
        product_category: this.productCategoryID,
        business_partner: this.businessCategoryID,
        turnover: this.turnOverVal,
      };      
      this._api.apiPost(API.QUEST_ENDPOINTS.SAVE_QUISTIONSRIES, data).subscribe({
      next:result=>{
        if (result.message) {
          this.isProcessing = false;
          this.localStorage.KycAndQuesCheck = { questinarie : true}
          this.router.navigate(['/kyc/kycform']);
          this.toasterService.Success('First Process Completed');
        } else {
          let msg = (result.message) ? result.message : 'Unable to next process.';
          this.questionForm.reset();
          this.toasterService.Error(msg);
          this.isProcessing = false;
        }
       },
       error: err => {
        let msg = err;
        this.toasterService.Error(msg);
        this.isProcessing = false;
      },
      complete: () => {
        this.isProcessing = false;
      }
     })
   }else{
     this.toasterService.Error("Please select all required fields.");
   }
 }
}
