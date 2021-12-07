import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import anime from 'animejs';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: [
    './landing-page.component.scss',
    './landing-page.component-responsive.scss',
  ],
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  mainDiv: any;
  words: string[] = [];
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.words = [
      '#CONSTANCIA',
      '#TECNICA',
      '#DETERMINACION',
      '#FUERZA',
      '#CORAJE',
      '#DISCLIPLINA',
      '#ENTRENAMIENTO',
      '#GYMLIFE',
      '#STRONGISTHENEWSEXY',
      '#STRONGISSEXY',
      '#TRAINER',
      '#IFBB',
      '#GIRLPOWER',
      '#IFBBMX',
      '#TRAINER',
    ];
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.mainDiv = this.document.querySelector('.header');

    this.animarTitulo();
    setTimeout(() => {
      this.changeHashtagPosition();
      this.animarHashtags();
    }, 8000);
  }
  animarTitulo() {
    const textWrapper = this.document.querySelector('.an-1') || ('' as any);
    if (!textWrapper) return;
    textWrapper.innerHTML = textWrapper.textContent?.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );
    anime.timeline({ loop: false }).add({
      targets: '.an-1 .letter',
      scale: [4, 1],
      opacity: [0, 1],
      translateZ: 0,
      easing: 'easeOutExpo',
      duration: 3000,
      delay: (el: any, i: number) => 70 * i,
    });
    anime.timeline({ loop: false }).add({
      targets: '.fadeIn',
      opacity: [0, 1],
      duration: 2000,
      easing: 'easeOutExpo',
      delay: 3500,
      update: (anim: any) => {},
      complete: () => {
        //this.startLightning();
      },
    });
  }
  animarHashtags() {
    anime
      .timeline({ loop: true })
      .add({
        targets: '.firstanim',
        opacity: [0, 1],
        easing: 'easeInOutExpo',
        duration: 4000,
        delay: (el: any, i: number) => 70 * (i * 20),
        direction: 'alternate',
      })
      .add({
        targets: '.firstanim',
        opacity: [1, 0],
        easing: 'easeInOutExpo',
        duration: 4500,
        direction: 'alternate',
        delay: (el: any, i: number) => {
          return 1000;
        },
        complete: (anim: any) => {
          //this.startLightning();
          this.changeHashtagPosition();
        },
      });
  }
  startLightning() {
    anime.timeline({ loop: false }).add({
      targets: '.animatedImage',
      opacity: [0, 0.8, 0, 0.8, 0, 0],
      easing: 'easeInOutExpo',
      duration: 2000,
      direction: 'alternate',
    });
  }
  changeHashtagPosition() {
    let elms = this.document.getElementsByClassName('firstanim');
    for (let index = 0; index < elms.length; index++) {
      const element = elms[index];
      let position = this.getRandomPosition(
        this.mainDiv?.clientWidth,
        this.mainDiv?.clientHeight,
        element
      );
      if (!position) return;
      let child = element.children[0];

      element.setAttribute(
        'style',
        `top:${position.top}px!important;left:${position.left}px!important;`
      );
      child.setAttribute('style', `color:${this.pickRandomColor()}!important;`);
    }
  }
  getRandomPosition(
    width: number | undefined,
    height: number | undefined,
    element: Element
  ) {
    if (!width || !height) {
      return undefined;
    }
    return {
      left: Math.floor(Math.random() * (width - element.clientWidth)),
      top: Math.floor(Math.random() * (height - element.clientHeight)),
    };
  }
  pickRandomColor() {
    let color = [
      '#FF0018',
      '#FFA52C',
      '#FFFF41',
      '#008018',
      '#0000F9',
      '#86007D',
      '#ffffff',
      '#D51218',
    ];
    var item = color[Math.floor(Math.random() * color.length)];
    return item;
  }
}
