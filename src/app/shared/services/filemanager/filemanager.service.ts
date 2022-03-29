import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  /**
   *
   */
  constructor(private storage: AngularFireStorage) {}
  async uploadFileAndGetUrl(file: any, path: string) {
    try {
      const fileRef = this.storage.ref(path);
      const task = this.storage.upload(path, file);
      let taskRef = await task.snapshotChanges().toPromise();
      let url = await fileRef.getDownloadURL().toPromise();
      return url;
    } catch (error) {
      console.warn(error);
      return null;
    }
  }
  async deleteFile(fileUrl: string) {
    try {
      const fileRef = this.storage.refFromURL(fileUrl);
      await fileRef.delete().toPromise();
    } catch (error) {
      console.warn('No se pudo borrar', error);
    }
  }
}
