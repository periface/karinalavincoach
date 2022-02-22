import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ICONS } from './icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'plantilla-base';
  static isBrowser = new BehaviorSubject<boolean>(false);
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(this.platformId));

    let icons = new ICONS();
    iconRegistry.addSvgIconLiteral(
      'instagram',
      sanitizer.bypassSecurityTrustHtml(icons.INSTAGRAM)
    );
    iconRegistry.addSvgIconLiteral(
      'wasap',
      sanitizer.bypassSecurityTrustHtml(icons.WHATSAPP)
    );
  }
}
