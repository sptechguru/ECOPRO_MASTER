import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alertpop',
  templateUrl: './alertpop.component.html',
  styleUrls: ['./alertpop.component.css']
})
export class AlertpopComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public id: any,
    public dialog : MatDialogRef<AlertpopComponent>,
  ) { }

  ngOnInit(): void {
  }
  data = `Your Password has been changed successfully! <br>
  Use your new password to login`

}
