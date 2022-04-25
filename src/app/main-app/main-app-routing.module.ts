import { CasosExitoComponent } from './casos-exito/casos-exito.component';
import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedToLogin } from '../shared/services/pipes/redirect-login.pipe';
import { MainAppComponent } from './main-app.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { SeguridadComponent } from './seguridad/seguridad.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RoutinesComponent } from './routines/routines.component';
import { CreateRoutineComponent } from './routines/create-edit/create-edit-routine.component';
import { EjerciciosComponent } from './excersices/ejercicios/ejercicios.component';
import { GenerarEjercicioComponent } from './excersices/ejercicios/crear-ejercicio/generar-ejercicio/generar-ejercicio.component';
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
        path: 'ejercicios',
        component: EjerciciosComponent,
      },
      {
        path: 'crear-ejercicio',
        component: GenerarEjercicioComponent,
      },
      {
        path: 'crear-ejercicio/:id',
        component: GenerarEjercicioComponent,
      },
      {
        path: 'rutinas',
        component: RoutinesComponent,
      },
      {
        path: 'crear-rutina',
        component: CreateRoutineComponent,
      },{
        path: 'crear-rutina/:id',
        component: CreateRoutineComponent,
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
