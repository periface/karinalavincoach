import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BaseComponent } from 'src/app/shared/components/base-component.component';

@Component({
  templateUrl: './detalle-zonas.component.html',
})
export class DetalleZonasComponent extends BaseComponent {
  /**
   *
   */
  constructor(
    public dialogRef: MatDialogRef<DetalleZonasComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    console.log(data);
  }
}
