import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { InscribirseButtonComponent } from './inscribirse-button/inscribirse-button.component';

@NgModule({
  imports: [CommonModule, AngularMaterialModule, RouterModule],
  declarations: [InscribirseButtonComponent],
  exports: [InscribirseButtonComponent],
})
export class SharedComponentsModule {}
