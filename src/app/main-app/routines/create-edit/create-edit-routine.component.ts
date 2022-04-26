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
    domingo: [],
  };
  temporal: any[] = [];
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
      .collection('ejercicios', (ref) => ref.orderBy('name'))
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
        this.temporal = data;
        console.log(this.ejercicios);
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
  changeZone($event: any) {
    const filterValue = $event;
    console.log(filterValue);
    this.ejercicios = this.temporal.filter((a) => a.zonaBase == filterValue);
  }
  getIconName(item: any) {
    switch (item.zonaBase) {
      case 'superior-hombro':
        return '/assets/img/shoulder.svg';
      case 'superior-espalda':
        return '/assets/img/human-back-side.svg';
      case 'superior-pecho':
        return '/assets/img/chest-male.svg';
      case 'superior-brazos':
        return '/assets/img/arm-muscles.svg';

      case 'superior-abdomen':
        return '/assets/img/abs-six-pack.svg';
      case 'inferior-cuadricep':
        return '/assets/img/knee.svg';
      case 'inferior-femoral':
        return '/assets/img/knee.svg';
      case 'inferior-pantorrilla':
        return '/assets/img/knee.svg';
      case 'inferior-gluteo':
        return '/assets/img/buttock-underwear.svg';
      case 'otros-cardio':
        return '/assets/img/walking.svg';
      case 'otros-calentamiento':
        return '/assets/img/fitness.svg';
      case 'otros-estiramiento':
        return '/assets/img/girl-exercise-workout-pose.svg';
      default:
        return '/assets/img/gym.svg';
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
