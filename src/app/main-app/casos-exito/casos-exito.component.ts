import { ConfirmComponent } from './../../shared/components/confirm/confirm.component';
import { CasosExitoCreateComponent } from './casos-exito-create/casos-exito-create.component';
import { MatDialog } from '@angular/material/dialog';
import { CasosExitoService } from './../../shared/services/casos-exito/casos-exito.service';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
import { Component, OnInit } from '@angular/core';
import { CasoExito } from 'src/app/shared/services/courses/models/caso-exito';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  templateUrl: './casos-exito.component.html',
  styleUrls: ['./casos-exito.component.scss'],
})
export class CasosExitoComponent extends BaseComponent implements OnInit {
  casosExito: CasoExito[] = [];
  constructor(
    private casosExitoService: CasosExitoService,
    private matDialog: MatDialog
  ) {
    super();
  }
  ngOnInit(): void {
    this.casosExitoService.getCasosExito().subscribe((data) => {
      this.casosExito = data;
    });
  }
  crear(element?: CasoExito) {
    console.log(element);
    let dialogRef = this.matDialog.open(CasosExitoCreateComponent, {
      data: element || null,
    });
    dialogRef.afterClosed().subscribe((elm) => {
      console.log(elm);
    });
  }
}
