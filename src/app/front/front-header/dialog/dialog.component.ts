import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {
  logins: any;
  signupForm= true;
  forgotForm= false;
  passwordFrom: boolean;
  livestock: boolean;
  verificationForm: boolean;
  hide = true;
  parentData:any;
  accestoken:any;
  showclose="false";
  
  public list = document.getElementById('main-body');

  constructor(@Inject(MAT_DIALOG_DATA) public id: any,private matDialog: MatDialog, 
  public dialogRef: MatDialogRef<DialogComponent>) {
    this.list.classList.add('open-modal');
  }
    
  showforget(){
    this.logins= false;
    this.forgotForm= true;
  }

  completeProfile(){
    this.signupForm= true;
    this.logins= false;
  }

  ngOnDestroy(): void {
    this.list.classList.remove('open-modal');
  }
  onMessageFromChild(message: string) {   
    this.showclose=message

    //this.messageFromChild = message;
  }

  ngOnInit(): void {
    console.log("sss",this.parentData)
    this.logins = this.id.login;
    this.signupForm = this.id.signup;

    // this.accestoken = localStorage.getItem('tokens');
    // console.log(this.accestoken);
    
  }
}

