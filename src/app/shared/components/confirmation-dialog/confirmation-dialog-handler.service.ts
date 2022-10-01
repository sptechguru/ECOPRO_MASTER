import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent, DialogData } from "./confirmation-dialog.component";

@Injectable()
export class ConfirmationDialogHandlerService {
    private dialogRef
    constructor(public dialog: MatDialog) { }

    openDialog(data: DialogData): any {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: data
        });

        return this.dialogRef.afterClosed();
        // .subscribe(result => {
        //     console.log('The dialog was closed : ', result);
        //     this.animal = result;
        // });
    }
}
