import { ConfirmComponent } from './confirm/confirm.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { CasoExitoComponent } from '../casos-exito/caso-exito.component';
import { InscribirseButtonComponent } from './inscribirse-button/inscribirse-button.component';

@NgModule({
  imports: [CommonModule, AngularMaterialModule, RouterModule],
  declarations: [
    InscribirseButtonComponent,
    CasoExitoComponent,
    ConfirmComponent,
  ],
  exports: [InscribirseButtonComponent, CasoExitoComponent, ConfirmComponent],
})
export class SharedComponentsModule {}
