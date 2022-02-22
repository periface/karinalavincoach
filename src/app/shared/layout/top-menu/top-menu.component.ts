import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';
class CustomRoute {
  title?: any;
  url?: any;
  icon?: any;
  id?: string;
}
@Component({
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss', './top-menu.component.mobile.scss'],
  selector: 'app-top-menu',
})
export class TopMenuComponent {
  /**
   *
   */

  routes: CustomRoute[] = [
    {
      title: 'Inicio',
      url: '/',
    },
    {
      title: 'Conferencias Pagda',
      url: 'pagda',
    },
    {
      title: 'Ventanilla Única',
      url: 'ventanillaunica',
    },
    {
      title: () => {
        let userId = this.localStorageService.getUserId;
        if (userId) {
          return 'Mi Cuenta';
        }
        return 'Acceder';
      },
      url: () => {
        let userId = this.localStorageService.getUserId;
        if (userId) {
          if (this.localStorageService.surveyFinished) {
            return 'users/dashboard';
          }
          return 'users/mainform';
        }
        return 'auth';
      },
    },
  ];
  activeMediaQuery: string | undefined;
  constructor(
    private localStorageService: LocalstorageService,
    private auth: AngularFireAuth
  ) {}
  isFunction(functionToCheck: any) {
    let isAFunction =
      functionToCheck &&
      {}.toString.call(functionToCheck) === '[object Function]';
    if (isAFunction) {
      return functionToCheck();
    }
    return functionToCheck;
  }
}
