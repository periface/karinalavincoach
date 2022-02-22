import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { MainAppComponent } from './main-app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MainAppRoutingModule } from './main-app-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SeguridadComponent } from './seguridad/seguridad.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './seguridad/change-password-dialog/change-password.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
@NgModule({
  imports: [
    MainAppRoutingModule,
    FlexLayoutModule,
    AngularMaterialModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [],
  declarations: [
    MainAppComponent,
    UsuariosComponent,
    SeguridadComponent,
    ChangePasswordComponent,
    MiCuentaComponent,
  ],
  providers: [],
})
export class MainAppModule {}