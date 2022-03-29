import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppInjector } from '../core/app-injector';
import { LocalStorageLocations } from '../services/localstorage/localstorage.constants';
import { LocalstorageService } from '../services/localstorage/localstorage.service';
@Component({
  template: '',
})
export class BaseComponent {
  /**
   *
   */
  /**
   *
   */

  public roles = {
    ADMIN: 'ADMINISTRADOR',
    CONFERENCISTA: 'CONFERENCISTA',
  };
  isFunction(functionToCheck: any) {
    let isAFunction =
      functionToCheck &&
      {}.toString.call(functionToCheck) === '[object Function]';
    if (isAFunction) {
      return functionToCheck();
    }
    return functionToCheck;
  }
  protected localStorageService: LocalstorageService;
  public config = {};
  http: HttpClient;
  constructor() {
    this.localStorageService = AppInjector.injector.get(LocalstorageService);
    this.http = AppInjector.injector.get(HttpClient);
    let config = this.localStorageService.getItem(
      LocalStorageLocations.APP_CONFIG
    );
    if (config) {
      this.config = JSON.parse(config);
    }
  }
  public waitFor = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Comprueba si el usuario actual tiene determinado rol
   * @param role
   * @param userId
   * @returns boolean
   */
  public hasRole(role: string) {
    try {
      let user = this.localStorageService.userData;
      if (user) {
        if (user.rol === role) {
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  //Construye el objeto de conferencia para usarse en la UI
  buildCourseObject(obj: any) {
    let courseObj = {
      title: obj.title,
      backgroundInstructions: {
        background: `${obj.backgroundInstructions}`,
      },
      url: `${obj.url}`,
      colorLetter: {
        color: `${obj.colorLetter}`,
      },
      img: `${obj.img}`,
      date: `${obj.date}`,
      id: obj.id,
      finished: obj.finished,
    };
    return courseObj;
  }
  datesAreOnSameDay(first: Date, second: Date) {
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  }

  private default(value: any, fallbackValue: any) {
    if (!value) {
      return fallbackValue;
    }
    return value;
  }
  public handleDate(date: any) {
    try {
      return date.toMillis();
    } catch (error) {
      return date;
    }
  }
  public async getIPAddress() {
    try {
      let ipLocal = this.localStorageService.getItem(
        LocalStorageLocations.IP_ADDRESS
      );
      if (ipLocal) {
        return JSON.parse(ipLocal);
      }
      const ip = await this.http
        .get('https://api.ipify.org/?format=json')
        .toPromise();
      return ip;
    } catch (error) {
      return {
        ip: 'NOT_FOUND',
      };
    }
  }
}
