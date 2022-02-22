import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage/localstorage.service';
import { ErrorDialogService } from './error-dialog/error-dialog.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private errorDialogService: ErrorDialogService,
    private zone: NgZone,
    private afs: AngularFirestore,
    private localStorageService: LocalstorageService,
    private router: Router
  ) {}

  handleError(error: any) {
    // Check if it's an error from an HTTP response
    console.warn(error);
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection; // get the error object
    }
    this.zone.run(
      () => {
        try {
          console.warn('Registrando reporte', error);
          this.afs.collection('error-reports').add({
            date: new Date(Date.now()),
            user: this.localStorageService.userData,
            url: this.router.url,
            error: JSON.stringify(error),
          });
        } catch (error) {
          console.log('Logger error', error);
        }
      }
      // this.errorDialogService.openDialog(
      //   error?.message || 'Undefined client error',
      //   error?.status
      // )
    );

    console.error('Error from global error handler', error);
  }
}
