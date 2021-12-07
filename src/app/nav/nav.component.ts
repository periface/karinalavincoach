import { AfterViewInit, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
declare var anime: any;
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements AfterViewInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}
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
