import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    title?: string;
    question?: string;
    confirmText?: string;
    cancelText?: string;
}

@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public diologConfig: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}