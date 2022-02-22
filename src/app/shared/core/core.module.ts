import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { ErrorDialogComponent } from './error-dialog/error-dialog-component/error-dialog.component';
import { GlobalErrorHandler } from './global-error-handler.service';
import { HttpLoadingInterceptor } from './http-error-handler.service';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog-component/loading-dialog.component';

@NgModule({
  declarations: [ErrorDialogComponent, LoadingDialogComponent],
  imports: [CommonModule, AngularMaterialModule],
  providers: [
    {
      // processes all errors
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      // interceptor to show loading spinner
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
