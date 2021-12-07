import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from './icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'plantilla-base';
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
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
