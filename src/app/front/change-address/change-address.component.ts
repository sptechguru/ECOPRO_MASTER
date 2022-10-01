import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router } from '@angular/router';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subject } from "rxjs/Subject";
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-change-address',
  templateUrl: './change-address.component.html',
  styleUrls: ['./change-address.component.css']
})
export class ChangeAddressComponent implements OnInit {

  connectLoader = false;
  countries = [];
  states = [];
  cities = [];
  addressForm: FormGroup;
  isProcessing: boolean;
  country_list: any;
  StateList: any;
  CityList: any;
  public country: FormControl = new FormControl();

  public countryFilterCtrl: FormControl = new FormControl();


  public filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  
  public state: FormControl = new FormControl();

  public stateFilterCtrl: FormControl = new FormControl();


  public filteredStates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public city: FormControl = new FormControl();

  public cityFilterCtrl: FormControl = new FormControl();


  public filteredCities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild("singleSelect") singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();

  constructor(
    private toasterService: ToasterService,
    private user : UserService,
    private Router : Router,
    public localStorage : StorageAccessorService,
    private fb: FormBuilder 
  ) { }

  ngOnInit(): void {
    this.countryList();
    this.createForm();
  }

  createForm() {
    this.addressForm = this.fb.group({
      is_default: ["", [Validators.required]],
      title: ["", [Validators.required]],
      address1: ["", [Validators.required]],
      address2: ["", [Validators.required]],
      country: ["", [Validators.required]],
      state: ["", [Validators.required]],
      city: ["", [Validators.required]],
      pincode: ["", [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]]
    });
  }

  handleSubmit(){
    this.connectLoader = true;
    let address_data = {
      'title': this.addressForm.value.title,
      'address_line_1': this.addressForm.value.address1,
      'address_line_2': this.addressForm.value.address2,
      'pincode': this.addressForm.value.pincode,
      'is_default': this.addressForm.value.is_default,
      'city_id': this.addressForm.value.city,
      'state_id': this.addressForm.value.state,
      'country_id': this.addressForm.value.country,
    };
      this.isProcessing = true;
      let userData = this.localStorage.fetchData();
      this.user.createAddress(userData["data"].id, address_data).subscribe({
        next: result => {
          if (result["message"]) {
            this.toasterService.Success(result["message"]);
            this.Router.navigate(["/delivery-detail"]); 
          } else {
            this.toasterService.Error(result["message"]);
          }
          this.isProcessing = false;
        },
        error: err => {
          this.toasterService.Error(err);
          this.isProcessing = false;
        },
        complete: () => {
          this.isProcessing = false;
        }
      });
}
  
countryList(){
  this.connectLoader = true
  this.user.countryList().subscribe((response:any)=>{
    if(response.success){
      this.country_list = response.data.rows;
      this.connectLoader = false;
      this.filteredCountries.next(this.country_list.slice());

      this.countryFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCountries();
      });
    }
    else{
      this.toasterService.Error(response.message);
      this.connectLoader = false;
    }
  })
}

private filterCountries() {
  if (!this.country_list) {
    return;
  }
  let search = this.countryFilterCtrl.value;
  if (!search) {
    this.filteredCountries.next(this.country_list.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredCountries.next(
    this.country_list.filter(
      countries => countries.country.toLowerCase().indexOf(search) > -1
    )
  );
}

countryChange(e){
  this.stateList(e.value);
}

stateList(id){
  this.connectLoader = true
  this.user.stateList(id).subscribe((response:any)=>{
    if(response.success){
      this.StateList = response.data.rows; 
      this.connectLoader = false;
      this.filteredStates.next(this.StateList.slice());

      this.stateFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterStates();
        });
    }
    else{
      this.toasterService.Error(response.message);
      this.connectLoader = false;
    }
  })
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

stateChange(e){
  this.cityList(e.value);
}

cityList(id){
  this.connectLoader = true
  this.user.cityList(id).subscribe((response:any)=>{
    if(response.success){
      this.CityList = response.data.rows 
      this.connectLoader = false;
      this.filteredCities.next(this.CityList.slice());

      this.cityFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCities();
        });
    }
    else{
      this.toasterService.Error(response.message);
      this.connectLoader = false;
    }
  })
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

  
  deliveryDetail(){
    this.Router.navigate(["/delivery-detail"]); 
  }
}
