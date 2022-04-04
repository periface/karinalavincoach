import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseComponent } from 'src/app/shared/components/base-component.component';

@Component({
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.scss'],
})
export class EjerciciosComponent extends BaseComponent {
  groups: any = [];
  /**
   *
   */
  constructor(private afs: AngularFirestore) {
    super();
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
}
