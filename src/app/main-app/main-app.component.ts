import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { BaseComponent } from '../shared/components/base-component.component';
import { LocalstorageService } from '../shared/services/localstorage/localstorage.service';

@Component({
  templateUrl: './main-app.component.html',
})
export class MainAppComponent extends BaseComponent {
  opened: boolean = true;
  activeMediaQuery: string | undefined;
  showMenuBtn: boolean = false;
  userProfile: any;
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    public localStorageService: LocalstorageService,
    private mediaObserver: MediaObserver
  ) {
    super();
    this.userProfile = this.localStorageService.userData;
    this.mediaObserver.asObservable().subscribe((change: MediaChange[]) => {
      change.forEach((item) => {
        this.activeMediaQuery = item
          ? `'${item.mqAlias}' = (${item.mediaQuery})`
          : '';
      });
      change[0].mqAlias === 'xs'
        ? ((this.opened = false), (this.showMenuBtn = true))
        : (this.showMenuBtn = false);
    });
  }
  async logOut() {
    await this.auth.signOut();
    this.localStorageService.clear();
    this.router.navigateByUrl('auth');
  }
  isAdmin() {
    return this.hasRole(this.roles.ADMIN);
  }
}
