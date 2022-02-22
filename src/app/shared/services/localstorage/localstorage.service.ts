import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { LocalStorageLocations } from './localstorage.constants';
class LocalStorage implements Storage {
  [name: string]: any;
  readonly length: number = 0;
  clear(): void {}
  getItem(key: string): string | null {
    return null;
  }
  key(index: number): string | null {
    return null;
  }
  removeItem(key: string): void {}
  setItem(key: string, value: string): void {}
}
@Injectable({
  providedIn: 'root',
})
export class LocalstorageService implements Storage {
  private storage = new LocalStorage();
  static isBrowser = new BehaviorSubject<boolean>(false);
  constructor() {
    this.length = 0;
    AppComponent.isBrowser.subscribe((isBrowser: any) => {
      if (isBrowser) {
        this.storage = localStorage;
      }
    });
  }

  [name: string]: any;

  length: number;

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    return this.storage.setItem(key, value);
  }
  get getUserId() {
    return this.storage.getItem(LocalStorageLocations.USER_ID);
  }
  get surveyFinished(): Boolean {
    try {
      let value = this.storage.getItem(
        LocalStorageLocations.USER_SURVEY_FINISHED
      );
      if (value) {
        return JSON.parse(value);
      }
      return false;
    } catch (error) {
      console.log('Error', error);
      return false;
    }
  }
  get userData(): any {
    try {
      let value = this.storage.getItem(LocalStorageLocations.USER_ACCOUNT_INFO);
      if (value) {
        return JSON.parse(value);
      }
      return {
        email: 'a@a.com',
        nombreCompleto: 'John Doe',
      };
    } catch (error) {
      console.log('Error', error);
      return {
        email: 'a@a.com',
        nombreCompleto: 'John Doe',
      };
    }
  }
}
