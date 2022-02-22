import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FooterComponent } from './footer/footer.component';
import { environment } from '../environments/environment';
import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { WindowRef } from './window';
import { AngularMaterialModule } from './shared/angular-material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AppInjector } from './shared/core/app-injector';
import { HttpClientModule } from '@angular/common/http';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LandingPageComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    EjerciciosComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularMaterialModule,
    HttpClientModule,
    FlexLayoutModule,
  ],
  providers: [ScreenTrackingService, UserTrackingService, WindowRef],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    // Create global Service Injector.
    AppInjector.injector = this.injector;
  }
}
