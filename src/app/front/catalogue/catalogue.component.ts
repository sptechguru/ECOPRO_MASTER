import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RemoveAlertComponent } from 'app/dialog/remove-alert/remove-alert.component';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UserService } from 'app/shared/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  dialogRef: MatDialogRef<RemoveAlertComponent>;
  @ViewChild('htmlData') htmlData:ElementRef;
  //private catalogue_list: Array<any> = [];
  catalogue_list: Array<any> = [];
  private tracking: any;
  catalogueList: any;
  offset = 0;
  limit = 10;
  downloadVal: boolean;
  totalArrayLimit: any;
  connectLoader = true;
  catalogue_id;
  pdfSrc;
  downlodDisable = true;
  arrayForRemove: any = [];
  downloadlink: any;

  constructor(
    private UserService: UserService, 
    private ToasterService: ToasterService,
    private _api : ApiHandlerService,
    public dialog :MatDialog,
    private sanitizer: DomSanitizer,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCatalogueList();
  }

  getCatalogueList(){
    this.connectLoader = true;
    this.UserService.getCatalogueList(this.offset, this.limit).subscribe(catalogueList=>{
      if(catalogueList["data"].rows.length > 0){
        this.catalogueList = catalogueList["data"].rows;
        this.connectLoader = false;
      }else{
        this.catalogueList = [];
        this.connectLoader = false;
      }
    });   
  }

  openRemoveAlert(id , catalogue_list){
   let test
    this.dialogRef = this.dialog.open(RemoveAlertComponent, 
       { 
      data: { val: id }
    })
    this.dialogRef.beforeClosed().subscribe(id => {
        if(id){
          this.UserService.deleteCatalogue(id , test).subscribe({ next: result=>{
            this.getCatalogueList();
            if(result && result['message']){
              this.ToasterService.Success('Catalogue removed successfully');
            } 
          },
          error:(err: any)=> {
              this.ToasterService.Warning("Catalogue have some product, Please remove product first.");
          }
          })
        }
        this.dialogRef = null;
    });
  }

  openMenu(id){
    this.UserService.downloadCatalogue(id).subscribe({next:response => {
      if(response["success"] == true){
        if(response["data"]){
          this.downloadlink = environment.baseUrl+''+response["data"];
         // this.ToasterService.Success(response["message"]); 
        }else{
          //this.ToasterService.Warning(response["message"]); 
        }
      }else{
        //this.ToasterService.Warning(response["message"]); 
      }
    },
    error: err=>{
      //this.ToasterService.Error(err.message);
    }   
  });
 }

 downloadCatalogue(){
    this.ToasterService.Warning("Catalogue don't have products, Please add product first."); 
 }
}
