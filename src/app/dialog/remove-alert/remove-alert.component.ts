import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-alert',
  templateUrl: './remove-alert.component.html',
  styleUrls: ['./remove-alert.component.css']
})
export class RemoveAlertComponent implements OnInit {
  fromPage: any;

  constructor(public dialogRef: MatDialogRef<RemoveAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.fromPage = data;
      console.log(this.fromPage)
    }

  ngOnInit(): void {
    var data = data
  }

  onNoClick(): void {
    this.dialogRef.close();
  } 

  removeCaltalogue(){
    
  }
  
}
