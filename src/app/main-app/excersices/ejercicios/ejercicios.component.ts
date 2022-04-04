import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseComponent } from 'src/app/shared/components/base-component.component';

@Component({
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.scss'],
})
export class EjerciciosComponent extends BaseComponent implements OnInit {
  groups: any = [];
  categorias: any[] = [];
  ejercicios: any[] = [];
  /**
   *
   */
  constructor(private afs: AngularFirestore) {
    super();
  }
  ngOnInit(): void {
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
    //     console.log(data);
    //     this.categorias = data;
    //     sub.unsubscribe();
    //   });
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
  }
  checkEx($event: any) {
    let file = $event.target.files[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      var obj = JSON.parse(e.target.result);
      let grp = this.groupBy(obj, 'Tipo');
      for (const key in grp) {
        if (Object.prototype.hasOwnProperty.call(grp, key)) {
          const element = grp[key];
          this.groups.push({ key, elements: this.buildElements(element) });
        }
      }
      console.log(this.groups);
    };
    reader.readAsText(file);
  }
  buildElements(elements: any[]) {
    let result = [];
    for (const ejercicio of elements) {
      let ejercicioObj = {
        Tipo: ejercicio.Tipo,
        Ejercicio: ejercicio.Ejercicio,
      } as any;
      let zonasMusculares = [];
      for (const key in ejercicio) {
        if (Object.prototype.hasOwnProperty.call(ejercicio, key)) {
          if (key === 'Tipo' || key === 'Ejercicio') continue;
          const value = ejercicio[key];
          //console.log('builder ' + key + ' ', property);
          let zonaMuscular = key.split('-');
          //console.log('zonaMuscular', zonaMuscular[0]);
          zonasMusculares.push({
            zona: zonaMuscular[0],
            subZona: zonaMuscular[1],
            carga: value,
          });
        }
      }

      zonasMusculares = zonasMusculares.filter((a) => a.carga !== '');
      let grp = this.groupBy(zonasMusculares, 'zona');

      for (const key in grp) {
        if (Object.prototype.hasOwnProperty.call(grp, key)) {
          const element = grp[key];
          if (!ejercicioObj.zonasMusculares) ejercicioObj.zonasMusculares = [];
          ejercicioObj.zonasMusculares.push({
            key,
            elements: element,
          });
        }
      }

      result.push(ejercicioObj);
    }
    return result;
  }
  async guardarTodo() {
    for await (const group of this.groups) {
      let categoria = { name: group.key, id: this.afs.createId() };
      await this.afs
        .collection('categoria-ejercicio')
        .doc(categoria.id)
        .set(categoria);

      for await (const ej of group.elements) {
        let ejercicio = {
          name: ej.Ejercicio,
          id: this.afs.createId(),
          idCategoria: categoria.id,
        };
        await this.afs
          .collection('ejercicios')
          .doc(ejercicio.id)
          .set(ejercicio);
        console.log(ejercicio);
        for await (const zona of ej.zonasMusculares) {
          let zonaMuscular = {
            zonaMuscular: zona.key,
            subZonas: zona.elements,
            id: this.afs.createId(),
            ejercicioId: ejercicio.id,
          };
          await this.afs
            .collection('zonas-musculares')
            .doc(zonaMuscular.id)
            .set(zonaMuscular);
        }
      }
    }
  }
}
