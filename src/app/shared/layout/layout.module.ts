import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AngularMaterialModule } from '../angular-material.module';
import { UnderMaintenanceComponent } from '../components/under-mant/under-mant.component';
import { FooterComponent } from './footer/footer.component';
import { TopMenuComponent } from './top-menu/top-menu.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AppUserMenuComponent } from './user-menu/user-menu.component';
@NgModule({
  exports: [
    TopMenuComponent,
    FooterComponent,
    UnderMaintenanceComponent,
    AppUserMenuComponent,
  ],
  declarations: [
    TopMenuComponent,
    FooterComponent,
    UnderMaintenanceComponent,
    AppUserMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    LazyLoadImageModule,
    FlexLayoutModule,
  ],
})
export class LayoutModule {}
