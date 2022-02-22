import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

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
