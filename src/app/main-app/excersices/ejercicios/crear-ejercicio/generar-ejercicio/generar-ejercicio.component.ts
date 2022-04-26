import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base-component.component';

@Component({
  selector: 'app-generar-ejercicio',
  templateUrl: './generar-ejercicio.component.html',
  styleUrls: ['./generar-ejercicio.component.scss'],
})
export class GenerarEjercicioComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  categorias: any[] = [];
  idEjercicio: string | undefined;
  zonasMusculares = [
    {
      zonaMuscular: 'PECHO',
      subZonas: [
        { carga: 0, subZona: 'PECTORAL SUPERIOR' },
        { carga: 0, subZona: 'PECTORAL MEDIO' },
        { carga: 0, subZona: 'PECTORAL INFERIOR' },
      ],
    },
    {
      zonaMuscular: 'HOMBRO',
      subZonas: [
        { carga: 0, subZona: 'DELTOIDES ANTERIOR' },
        { carga: 0, subZona: 'DELTOIDES MEDIO' },
        { carga: 0, subZona: 'DELTOIDES POSTERIOR' },
      ],
    },
    {
      zonaMuscular: 'BRAZO',
      subZonas: [
        { carga: 0, subZona: 'TRICEP' },
        { carga: 0, subZona: 'BICEPS' },
        { carga: 0, subZona: 'ANTEBRAZO' },
      ],
    },
    {
      zonaMuscular: 'ESPALDA',
      subZonas: [
        { carga: 0, subZona: 'ESPALDA DORSAL' },
        { carga: 0, subZona: 'ESPALDA REDONDO' },
        { carga: 0, subZona: 'SACROLUMBAR' },
        { carga: 0, subZona: 'TRAPECIO' },
      ],
    },
    {
      zonaMuscular: 'PIERNA',
      subZonas: [
        { carga: 0, subZona: 'GLÚTEO' },
        { carga: 0, subZona: 'CUÁDRICEPS' },
        { carga: 0, subZona: 'FEMORAL' },
        { carga: 0, subZona: 'GEMELO' },
      ],
    },
    {
      zonaMuscular: 'TORSO',
      subZonas: [
        { carga: 0, subZona: 'SERRATO' },
        { carga: 0, subZona: 'OBLICUO' },
        { carga: 0, subZona: 'ABDOMEN SUPERIOR' },
        { carga: 0, subZona: 'ABDOMEN ANTERIOR' },
      ],
    },
  ] as any[];
  constructor(
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    // let sub = this.afs
    //   .collection('categoria-ejercicio')
    //   .snapshotChanges()
    //   .pipe(
    //     map((actions) =>
    //       actions.map((a) => {
    //         const data = a.payload.doc.data() as any;
    //         data['id'] = a.payload.doc.id;
    //         return { ...data };
    //       })
    //     )
    //   )
    //   .subscribe((data) => {
    //     this.categorias = data;
    //     sub.unsubscribe();
    //   });

    this.formGroup = this.formBuilder.group({
      id: [''],
      idCategoria: [''],
      name: ['', Validators.required],
      zonaBase: [''],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.params.id;

    if (id) {
      this.formGroup.get('id')?.setValue(id);
      this.idEjercicio = id;
      this.afs
        .collection('ejercicios')
        .doc(this.idEjercicio)
        .get()
        .subscribe((action) => {
          this.formGroup.patchValue(action.data() as any);
        });
      this.afs
        .collection('zonas-musculares', (ref) =>
          ref.where('ejercicioId', '==', id)
        )
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
          let duplicates = data.concat(this.zonasMusculares);
          this.zonasMusculares = this.removeDuplicates(
            duplicates,
            'zonaMuscular'
          );
        });
    }
  }
  async save() {
    try {
      let id = this.idEjercicio ? this.idEjercicio : this.afs.createId();
      await this.afs.collection('ejercicios').doc(id).set(this.formGroup.value);
      this.idEjercicio = id;
    } catch (error) {
      console.log(error);
    }
  }
  async saveZonas() {
    for (const iterator of this.zonasMusculares) {
      let subZonasConCarga = iterator.subZonas.filter((a: any) => a.carga > 0);
      if (subZonasConCarga.length > 0) {
        console.log('con subzonas', iterator);
        let obj = iterator;
        obj.ejercicioId = this.idEjercicio;
        if (obj.id) {
          await this.afs.collection('zonas-musculares').doc(obj.id).set(obj);
        } else {
          obj.id = this.afs.createId();
          await this.afs.collection('zonas-musculares').doc(obj.id).set(obj);
        }
      } else {
        console.log('Sin subzonas', iterator);
        continue;
      }
    }
  }
  async delete() {
    console.log(this.idEjercicio);
    await this.afs.collection('ejercicios').doc(this.idEjercicio).delete();
  }
}
