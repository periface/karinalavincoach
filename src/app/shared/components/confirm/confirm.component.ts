import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalData } from './confirm-modal-data.model';

@Component({
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
  /**
   *
   */
  title: string | undefined;
  question: string | undefined;
  modalData: ConfirmModalData;
  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmModalData
  ) {
    this.modalData = data;
  }

  onNoClick(): void {
    this.dialogRef.close({
      response: false,
    });
  }
  onYesClick() {
    this.dialogRef.close({
      response: true,
    });
  }
}
