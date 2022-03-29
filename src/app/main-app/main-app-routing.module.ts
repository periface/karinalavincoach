import { CasosExitoComponent } from './casos-exito/casos-exito.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { redirectUnauthorizedToLogin } from '../shared/services/pipes/redirect-login.pipe';
import { MainAppComponent } from './main-app.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { SeguridadComponent } from './seguridad/seguridad.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
const routes: Routes = [
  {
    path: '',
    component: MainAppComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: 'seguridad',
        component: SeguridadComponent,
      },
      {
        path: 'micuenta',
        component: MiCuentaComponent,
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
      },
      {
        path: 'casos-exito',
        component: CasosExitoComponent,
      },
      {
        path: '',
        redirectTo: 'micuenta',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class MainAppRoutingModule {}
