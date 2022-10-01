import { Inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }

  openLoginDialog(): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose:true,
      data: { login: true },
      panelClass: 'signin-dialog'
    });
    return dialogRef.afterClosed();
  }

  openSignupDialog(): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose:true,
      data: { signup: true },
      panelClass: 'signup-dialog'
    });
    return dialogRef.afterClosed();
  }

  openUpdateEmailDialog(): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose:true,
      data: { updateEmail: true },
      panelClass: 'signup-dialog'
    });
    return dialogRef.afterClosed();
  }

  setKYC(value) {
    if(value){
      localStorage.setItem("kyc", JSON.stringify(value));
    }else if(value === ''){
      localStorage.removeItem("kyc");
    }
  }

  setBilling(value) {
    if(value){
      localStorage.setItem("billing", JSON.stringify(value));
    }else if(value === ''){
      localStorage.removeItem("billing");
    }
  }

  getKYC(){

  }
}
