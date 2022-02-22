import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { Routes, RouterModule } from '@angular/router';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainAppComponent } from './main-app/main-app.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { redirectUnauthorizedToLogin } from './shared/services/pipes/redirect-login.pipe';

const routes: Routes = [
  {
    path: 'home',
    component: LandingPageComponent,
  },
  {
    path: 'panel-de-control',
    loadChildren: () =>
      import('./main-app/main-app.module').then((m) => m.MainAppModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'ejercicios',
    component: EjerciciosComponent,
  },
  {
    path: 'politica-privacidad',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () =>
      import('./main-app/auth/auth.module').then((m) => m.AuthModule),
  },
  { component: LandingPageComponent, path: '', pathMatch: 'full' },
  { component: LandingPageComponent, path: '**' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
