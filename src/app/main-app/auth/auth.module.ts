import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthComponent } from './auth.component';
@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class AuthModule {}
