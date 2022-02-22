import { AfterViewInit, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BaseComponent } from '../shared/components/base-component.component';
declare var anime: any;
class CustomRoute {
  title?: any;
  url?: any;
  icon?: any;
  id?: string;
}
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent extends BaseComponent implements AfterViewInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  routes: CustomRoute[] = [
    {
      title: () => {
        let userId = this.localStorageService.getUserId;
        console.log(userId);
        if (userId) {
          return 'Mi Cuenta';
        }
        return 'Iniciar sesión';
      },
      url: () => {
        let userId = this.localStorageService.getUserId;
        if (userId) {
          return 'panel-de-control';
        }
        return 'auth';
      },
    },
  ];
  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AngularFireAuth
  ) {
    super();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const textWrapper = document.querySelector('.kartxt') || ('' as any);
      if (!textWrapper) return;
      textWrapper.innerHTML = textWrapper.textContent?.replace(
        /\S/g,
        "<span class='letter'>$&</span>"
      );
      anime.timeline({ loop: false }).add({
        targets: '.kartxt .letter',
        color: [
          '#FF0018',
          '#FFA52C',
          '#FFFF41',
          '#008018',
          '#0000F9',
          '#86007D',
          '#ffffff',
        ],
        easing: 'easeOutExpo',
        duration: 3000,
        delay: (el: any, i: number) => 70 * i,
      });
    }, 2000);
  }
}
