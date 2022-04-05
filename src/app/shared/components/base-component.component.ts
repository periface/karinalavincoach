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
  groupBy(xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
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
  removeDuplicates(inArray: any[], comparableProp: string) {
    var arr = inArray.concat(); // create a clone from inArray so not to change input array
    //create the first cycle of the loop starting from element 0 or n
    for (var i = 0; i < arr.length; ++i) {
      //create the second cycle of the loop from element n+1
      for (var j = i + 1; j < arr.length; ++j) {
        //if the two elements are equal , then they are duplicate
        if (arr[i][comparableProp] === arr[j][comparableProp]) {
          arr.splice(j, 1); //remove the duplicated element
        }
      }
    }
    return arr;
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
