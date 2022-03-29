import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CasoExito } from '../courses/models/caso-exito';

@Injectable({
  providedIn: 'root',
})
export class CasosExitoService {
  constructor(public afs: AngularFirestore) {}
  getCasosExito(): Observable<CasoExito[]> {
    return this.afs
      .collection('casos-exito')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as CasoExito;
            return { ...data };
          })
        )
      );
  }
  getCasoExitoById(id: string) {
    return this.afs
      .collection('casos-exito')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as CasoExito;
          return { ...data };
        })
      );
  }
  /**
   *
   * @param casoExito
   * @returns id
   */
  async addCasoExito(casoExito: CasoExito): Promise<string> {
    if (!casoExito.id) {
      casoExito.id = this.afs.createId();
    }
    await this.afs.collection('casos-exito').doc(casoExito.id).set(casoExito);
    return casoExito.id;
  }
}
