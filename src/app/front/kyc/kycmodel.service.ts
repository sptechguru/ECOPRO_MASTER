import { DialogData } from './../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { KycComponent } from './kyc.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KycmodelService {

  private dialogRef
  constructor(public dialog: MatDialog) { }

  openDialog(data: DialogData): any {
      console.log("YESS")
      this.dialogRef = this.dialog.open(KycComponent, {
          width: '800px !important',
          data: data
      });

      return this.dialogRef.afterClosed();
      // .subscribe(result => {
      //     // console.log('The dialog was closed : ', result);
      //     this.animal = result;
      // });
  }
}
