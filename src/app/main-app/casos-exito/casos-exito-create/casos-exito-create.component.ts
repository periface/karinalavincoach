import { FileManagerService } from './../../../shared/services/filemanager/filemanager.service';
import { CasosExitoService } from './../../../shared/services/casos-exito/casos-exito.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    public dialogRef: MatDialogRef<CasosExitoCreateComponent>
  ) {
    super();
    this.formGroup = this.formBuilder.group({
      name: [''],
      description: [''],
      image: [''],
    });
  }
  ngOnInit(): void {}
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
}
