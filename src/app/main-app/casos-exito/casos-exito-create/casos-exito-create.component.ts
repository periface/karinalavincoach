import { CasoExito } from 'src/app/shared/services/courses/models/caso-exito';
import { FileManagerService } from './../../../shared/services/filemanager/filemanager.service';
import { CasosExitoService } from './../../../shared/services/casos-exito/casos-exito.service';
import { Component, Inject, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
@Component({
  templateUrl: './casps-exito-create.component.html',
  styleUrls: ['./casos-exito-create.component.scss'],
})
export class CasosExitoCreateComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;
  constructor(
    private casosExitoService: CasosExitoService,
    private fileManager: FileManagerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CasosExitoCreateComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: CasoExito
  ) {
    super();
    this.formGroup = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      image: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.data) {
      this.formGroup.patchValue(this.data);
      console.log(this.formGroup.value);
    }
  }
  async save() {
    let id = await this.casosExitoService.addCasoExito(this.formGroup.value);
    this.dialogRef.close({
      id,
    });
  }
  async uploadImage(event: any) {
    let file = event.target.files[0];

    if (this.formGroup.get('image')?.value) {
      await this.fileManager.deleteFile(this.formGroup.get('image')?.value);
    } else {
      const filePath = `casos-exito/${this.casosExitoService.afs.createId()}`;
      let filePathUrl = await this.fileManager.uploadFileAndGetUrl(
        file,
        filePath
      );
      this.formGroup.get('image')?.setValue(filePathUrl);
    }
  }
  async deleteFile() {
    await this.fileManager.deleteFile(this.formGroup.get('image')?.value);
    this.dialogRef.close();
  }
  delete(item: CasoExito) {
    let dialogRef = this.matDialog.open(ConfirmComponent, {
      data: {
        title: 'Eliminar elemento',
        question: '¿Desea eliminar este elemento?',
      },
    });
    dialogRef.afterClosed().subscribe(async (data: any) => {
      if (data.response) {
        await this.casosExitoService.deleteCaso(item);
        this.dialogRef.close();
      }
    });
  }
}
