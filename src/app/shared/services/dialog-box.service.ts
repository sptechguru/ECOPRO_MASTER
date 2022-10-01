import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/compiler/src/core';
import { AlertpopComponent } from 'app/dialog/alertpop/alertpop.component';

@Injectable({
  providedIn: 'root'
})
export class DialogBoxService {

  public dialogRef: MatDialogRef<Component>;
  public dialogRef2: MatDialogRef<AlertpopComponent>;

  constructor(private dialog: MatDialog) { }

  // tslint:disable-next-line: no-shadowed-variable
  openmodel(Component,data?){
     this.dialogRef = this.dialog.open(Component,{
      width:" ",data,panelClass:'custom-dialog-container-model',disableClose: true, autoFocus: false
    });
  }

  opensuccessAlertModal(head,text = '' , sub = ''){
    this.dialogRef2 = this.dialog.open(AlertpopComponent,{
      width:" ",data :{title : head, msg : text , sub },panelClass:'custom-dialog-container-model',disableClose: true, autoFocus: false
    });
  }
  get dialogBox(){
    return this.dialogRef;
  }
}
