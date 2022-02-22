import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { Routes, RouterModule } from '@angular/router';
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
    path: 'iniciar-sesion',
    loadChildren: () =>
      import('./main-app/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'panel-de-control',
    component: MainAppComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'politica-privacidad',
    component: PrivacyPolicyComponent,
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
