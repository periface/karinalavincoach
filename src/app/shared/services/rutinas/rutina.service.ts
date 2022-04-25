import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class RutinaService {
  constructor(private afs: AngularFirestore) {}

  async save(input: any) {
    let id = input.id;
    if (!id) {
      id = this.afs.createId();
      input.id = id;
    }
    await this.afs.collection('rutinas').doc(id).set(input, {
      merge: true,
    });
    return input;
  }
  getRutina(id: string) {
    return this.afs
      .collection('rutinas')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((action) => {
          const data = action.payload.data() as any;
          data['id'] = action.payload.id;
          return { ...data };
        })
      );
  }
  getAll() {
    return this.afs
      .collection('rutinas')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            data['id'] = a.payload.doc.id;
            return { ...data };
          })
        )
      );
  }
}
