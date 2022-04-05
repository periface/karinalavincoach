import { copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
@Component({
  templateUrl: './create-edit-routine.component.html',
  styleUrls: ['./create-edit-routine.component.scss'],
})
export class CreateRoutineComponent extends BaseComponent {
  /**
   *
   */
  @ViewChild(MatSort)
  groups: any = [];
  categorias: any[] = [];
  ejercicios: any[] = [];
  formGroup: FormGroup;
  constructor(
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ) {
    super();
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      pesoMin: ['', Validators.required],
      pesoMax: ['', Validators.required],
      estaturaMin: ['', Validators.required],
      estaturaMax: ['', Validators.required],
      description: [''],
      duracion: [''],
    });
    let sub = this.afs
      .collection('categoria-ejercicio')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            data['id'] = a.payload.doc.id;
            return { ...data };
          })
        )
      )
      .subscribe((data) => {
        this.categorias = data;
        sub.unsubscribe();
      });
    let exSb = this.afs
      .collection('ejercicios')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            data['id'] = a.payload.doc.id;
            return { ...data };
          })
        )
      )
      .subscribe((data) => {
        this.ejercicios = data;
        console.log(this.ejercicios);
        exSb.unsubscribe();
      });
  }
  save() {
    console.log(this.formGroup.value);
  }
  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  changeCat($event: any) {}
  applyFilter(event: Event) {}
}
