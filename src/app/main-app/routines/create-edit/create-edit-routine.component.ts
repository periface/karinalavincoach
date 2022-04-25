import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
import { RutinaService } from 'src/app/shared/services/rutinas/rutina.service';
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
  selected: any = {
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
  };
  detailsCompleted = false;
  formGroup: FormGroup;
  rutina: any;
  constructor(
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private rutinaService: RutinaService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.formGroup = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      pesoMin: ['', Validators.required],
      pesoMax: ['', Validators.required],
      estaturaMin: ['', Validators.required],
      estaturaMax: ['', Validators.required],
      description: ['', Validators.required],
      duracion: ['', Validators.required],
      sexo: ['', Validators.required],
      objetivo: ['', Validators.required],
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

        exSb.unsubscribe();
      });

    let id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.rutinaService.getRutina(id).subscribe((rutina) => {
        this.rutina = rutina;
        this.formGroup.patchValue(this.rutina);
        if (rutina.ejercicios) {
          this.selected = rutina.ejercicios;
        }
        this.detailsCompleted = true;
      });
    }
  }
  async save() {
    console.log(this.formGroup.value);
    let model = this.formGroup.value;
    model['ejercicios'] = this.selected;
    this.rutina = await this.rutinaService.save(model);
    if (this.rutina) {
      this.detailsCompleted = true;
    }
    console.log(this.selected);
  }
  drop(event: CdkDragDrop<any[]>) {
    console.log(event);
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
  removeItem(item: any, dia: string) {
    let arr = this.selected[dia] as any[];
    console.log(arr);
    let index = arr.findIndex((i) => i.id == item.id);
    this.selected[dia].splice(index, 1);
  }
  changeCat($event: any) {}
  applyFilter(event: Event) {}
}
