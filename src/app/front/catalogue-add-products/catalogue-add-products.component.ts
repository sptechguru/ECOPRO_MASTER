import { Component, Input, OnInit, Injectable  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { Options, LabelType } from 'ng5-slider';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SortByPipe } from 'app/shared/pipes/product-list-sort.pipe';

export class TodoItemNode {
  child: TodoItemNode[];
  product_category: string;
  id: number;
}

export class TodoItemFlatNode {
  product_category: string;
  level: number;
  id: number;
  expandable: boolean;
}

const TREE_DATA = {};

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }
  search: any;
  paramId: any;
  master_product_category_id: any;
  id: any;
  pid: any;
  parent_category: any;

  constructor(private _route: ActivatedRoute, private user: UserService) {
    this.initialize();
  }

  initialize() {
    this.user.categoriesList().subscribe(categoryList=>{
      let response : any = categoryList
      let data = {}
      data = response.data.rows;
      if(categoryList["success"] === true){
        const TREE_DATA = categoryList["data"].rows;
        const data = this.buildFileTree(TREE_DATA, 0);
        this.dataChange.next(data);
      }
     
    })
  }

  buildFileTree(value: any, level: number) {
    let data: any[] = [];
    data.push(value);
    return data[0];
  }
}


@Component({
  selector: 'app-catalogue-add-products',
  templateUrl: './catalogue-add-products.component.html',
  styleUrls: ['./catalogue-add-products.component.css'],
  providers: [ChecklistDatabase, SortByPipe]
})
export class CatalogueAddProductsComponent implements OnInit {

  currentLimit:any;
  totalArrayLimit:any;
  productDetails = [];
  preferedProductList= []
  tempProductListArr = [];
  filterProductList= [];
  connectLoader = true;
  default_image: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  offset: any;
  limit: any;
  preferedProductScrollListOne: Array<any> = [];
  preferedProductScrollListOnes: Array<any> = [];
  pid: any;
  productID: Array<any> = [];
  marginArray: Array<any> = [];
  catalogue_id: any;
  catalogueName: any;
  cid: any;
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true);
  categoryID: Array<any> = [];
  categoryDetails: any;
  
  constructor(private _route : ActivatedRoute, private _api : ApiHandlerService, 
    private fb: FormBuilder ,
    public translate: TranslateService,
    public localStorage: StorageAccessorService,
    private toasterService: ToasterService,
    private router: Router,
    private user: UserService,
    private _database: ChecklistDatabase) {
      this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
        this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        _database.dataChange.subscribe(data => {
          this.dataSource.data = data;
        });
    }


    getLevel = (node: TodoItemFlatNode) => node.level;
    isExpandable = (node: TodoItemFlatNode) => node.expandable;
    getChildren = (node: TodoItemNode): TodoItemNode[] => node.child;
    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.product_category === '';
    transformer = (node: TodoItemNode, level: number) => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode = existingNode && existingNode.id === node.id
          ? existingNode
          : new TodoItemFlatNode();
      flatNode.product_category = node.product_category;
      flatNode.id = node.id;
      flatNode.level = level;
      flatNode.expandable = !!node.child?.length;
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    }

  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  
    
  ngOnInit() {
    this.cid = this._route.snapshot.paramMap.get('cid');
    this.catalogue_id = this._route.snapshot.paramMap.get('id');
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
    this.categoriesPreferredList();
    this.getCatalogueProductListing();
  }

  /*----------------------- Prefered products list ---------------------*/

  getCatalogueProductListing(){
    this.connectLoader = true;
    this.user.getCatalogueProduct(this.catalogue_id).subscribe( productVarient=>{
      this.connectLoader = false;
      this.catalogueName = productVarient["data"].rows[0].catalogue_name;
      let response : any = productVarient;
      let data = [];
      data = response.data.rows;
      if(data && data.length>0){
        data.forEach((product, i)=>{ 
          if(product.product_variants.length>0){
            product.product_variants.forEach((variant, j)=>{ 
              this.productID.push(variant.id);
              this.marginArray.push(variant);
            }); 
          }else{
           
          }
        }); 
      }else{
        
      }
      //this.totalArrayLimit = productVarient["data"].total; 
      //this.totalArrayLimit = this.tempProductListArr.length; 
    })
  }

  categoriesPreferredList(){
    this.preferedProductList = [];
    const preferred = {
      category_id : []
    }
    this.connectLoader = true;
    this.offset = 0;
    this.limit = 10;
    this.user.categoriesPrefered(preferred,this.offset,this.limit).subscribe(preferedProductList=>{
      if(preferedProductList["success"] === true){
        if(preferedProductList["data"].rows.length>0){
           let response : any = preferedProductList
           let data = [];
           data = response.data.rows;
           this.preferedProductScrollListOne = data;
           this.preferredProductVariantImage(data, preferedProductList["data"].total);
        }else{
            this.connectLoader = false;
            this.tempProductListArr = [];
            this.preferedProductList = [];
            this.toasterService.Warning("No record found");
        } 
      }        
    })
  }

  preferredProductVariantImage(data, total){
    this.tempProductListArr = [];
    data.forEach((product, i)=>{ 
      if(product.product_variants.length>0){ 
        product.product_variants.forEach((variant, j)=>{
          variant["checked"] = "false";
          if(this.productID.length>0){ 
            this.productID.forEach((arrayId, index)=>{
              if(variant.id === arrayId){
                variant.checked = "true";
              }
            }); 
          } 
          
          if(variant.product_images.length>0){
          let results = variant.product_images.filter((x,k) => {
            if(x.is_feature === "yes"){
              return x.is_feature && x.product_variant_image_150x150;
            }
          });
         

          if(results.length>0){
            this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
              product_variants: variant, featured_image: results[0].product_variant_image_150x150, 
              is_feature: results[0].is_feature, category_id: product.master_product_category_id, 
              id: variant.id}) 
          }else{
            if(variant.product_images[0].product_variant_image_500x500){
              this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
                product_variants: variant, featured_image: variant.product_images[0].product_variant_image_500x500, 
                is_feature: 'no', category_id: product.master_product_category_id, id: variant.id})
            }else{
              this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
                product_variants: variant, featured_image: this.default_image, 
                is_feature: 'no', category_id: product.master_product_category_id, id: variant.id})
            }
           
          }
        }else{
          let result3 = this.default_image;
          this.tempProductListArr.push({ids: product.id,product_name: product.product_name,
            product_variants: variant, featured_image: result3, 
            is_feature: 'no', category_id: product.master_product_category_id, id: variant.id}) 
        }
      }); 
     }else{
        this.toasterService.Warning("Product variant not found");
     } 
    }); 
     //this.totalArrayLimit = this.tempProductListArr.length;
     this.totalArrayLimit = total;
     this.preferedProductList = this.tempProductListArr;
     this.currentLimit = this.preferedProductList.length;
     this.connectLoader = false;
  }

  getCheckboxValues(e, val, index){
    console.log(val);
    if(e.checked){
      this.productID.push(val.id);  
    }else{
      var whatIndex = null;
      this.productID.forEach(function(value, index){
        if(value === val.id){
          whatIndex = index;
        }
      });
      console.log(this.productID);
      this.productID.splice(whatIndex, 1);
    }
  }

  saveProducts(){
    if(this.productID.length>0){
      let body = {
        variant_list: this.productID
      }
      this.user.addProductCatalogue(this.catalogue_id, body).subscribe(addProductRes =>{
        if(addProductRes && addProductRes['message']){
          if(this.cid){
            this.router.navigate(['/catalogue-product-list/'+this.cid+'/'+this.catalogue_id]);
          }else if(!this.cid){
            this.router.navigate(['/catalogue-product-list/'+this.catalogue_id]);
          }
          this.toasterService.Success('Product added into catalogue successfully');
        }
      })
    }else{
      this.toasterService.Warning('Please select at least one product');
    }
  }

  minValue: number = 50;
  maxValue: number = 50000;
  options: Options = {
    floor: 50,
    ceil: 50000,
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
    }
  };
  
  getFilterProductByCategory(val, e){
    this.connectLoader = true; 
    if(e.checked){
      this.categoryID.push(val.id);  
    }else{
      var whatIndex = null;
      this.categoryID.forEach(function(value, index){
        if(value === val.id){
          whatIndex = index;
        }
      });
      this.categoryID.splice(whatIndex, 1);
    }
    if(this.categoryID.length>0){
      let filterArray = {
        "category_ids": this.categoryID,
        "base_price": {}
      }; 
      this.getFilteredProductList(filterArray);
    }else{
      this.categoriesPreferredList();
    }
  }

  getFilteredProductList(filterArray){
    this.offset = 0;
    this.limit = 10;
    this.connectLoader = true; 
    this.user.getFilteredProduct(filterArray, '', this.offset, this.limit).subscribe(categoryDetails=>{
      if(categoryDetails["success"] === true){
        if(categoryDetails["data"].rows.length>0){
          let response : any = categoryDetails;
          let data = [];
          data = response.data.rows;
          this.preferedProductScrollListOne = data;
          this.preferredProductVariantImage(data, categoryDetails["data"].total);
          this.connectLoader = false; 
        }else{
          this.connectLoader = false;
          this.tempProductListArr = [];
          this.preferedProductList = [];
          this.toasterService.Warning("No record found");
        }
      }
    });
  }

  onScrollDown1(){
    if(this.categoryID.length>0){ 
      this.preferedProductScrollListOne = [];
      this.offset += this.limit;
      let filterArray = {
        "category_ids": this.categoryID,
        "base_price": {}
      }; 
      this.user.getFilteredProduct(filterArray, '', this.offset, this.limit)
      .subscribe(preferedProductList=>{
      if(preferedProductList["success"] === true){
        if(preferedProductList["data"].rows.length>0){
          for (let j = 0; j < preferedProductList["data"].rows.length; j++) {
            this.preferedProductScrollListOnes['push'](preferedProductList["data"].rows[j]);
          }
          this.preferredProductVariantImage(this.preferedProductScrollListOnes, preferedProductList["data"].total); 
        }
      }   
    });
    }else{
      this.preferedProductScrollListOnes = [];
      this.offset += this.limit;
      const preferred = {
        category_id : []
      }
      this.user.categoriesPrefered(preferred, this.offset, this.limit).subscribe(preferedProductList=>{
        if(preferedProductList["success"] === true){
          if(preferedProductList["data"].rows.length>0){
            for (let j = 0; j < preferedProductList["data"].rows.length; j++) {
              this.preferedProductScrollListOne['push'](preferedProductList["data"].rows[j]);
            }
            this.preferredProductVariantImage(this.preferedProductScrollListOne, preferedProductList["data"].total); 
          }
        }      
      });
    }
  }

}
