import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})

export class CategoriesComponent implements OnInit {

  categoryList = []
  showMoreCategory :any;
  nextPage:any;
  tempArray:any;
  arrayLimit:any;
  currentLimit:any;
  totalArrayLimit:any;
  items = []
  sub_items = []
  item_name = []
  connectLoader = true;
  default_image: any;
  hover = false;
  
  constructor(
    private _route : ActivatedRoute,
    private _api : ApiHandlerService,
    private fb: FormBuilder ,
    public translate: TranslateService,
    public localStorage: StorageAccessorService,
    private toasterService: ToasterService,
    private router: Router,
    private user: UserService
  ) { }


  ngOnInit(): void {
    this.arrayLimit = 10;
    this.categoriesList();
    window.addEventListener('scroll',this.scrollCategory,true);
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
  }

  categoriesList(){
    this.connectLoader = true
    this.user.categoriesList().subscribe(categoryList=>{
      let response : any = categoryList
      let data = {}
      //console.log(response);
      data = response.data
      this.items = response.data.rows 
      this.sub_items = response.data.rows;
      this.totalArrayLimit = this.items.length;
      for(var i=0;i<this.arrayLimit;i++){
        if(this.items[i]){
          this.categoryList.push(this.items[i]);
        }
        console.log();
        
      }
      this.currentLimit = this.categoryList.length;
      this.connectLoader = false
    })
  }

  showMoreCategoriesList(){
      if(this.totalArrayLimit!=this.currentLimit){
        this.arrayLimit += 10;
      for(var i=this.currentLimit;i<this.arrayLimit;i++){
        if(this.items[i] != undefined){
          this.categoryList.push(this.items[i])
        }
      }
      this.currentLimit = this.categoryList.length;
      }
  }

  scrollCategory = (event)=> {
    const scrollTop = event.srcElement.scrollTop;
    if(this.totalArrayLimit>=this.currentLimit){
      this.showMoreCategoriesList();
    }
  }

}
