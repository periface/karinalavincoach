import { CasosExitoService } from './../services/casos-exito/casos-exito.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base-component.component';
import { CasoExito } from '../services/courses/models/caso-exito';
@Component({
  templateUrl: './caso-exito.component.html',
  styleUrls: ['./caso-exito.component.scss'],
  selector: 'app-success-gallery',
})
export class CasoExitoComponent extends BaseComponent implements OnInit {
  casosExito: CasoExito[] = [];
  constructor(private casoExitoService: CasosExitoService) {
    super();
  }
  ngOnInit(): void {
    this.casoExitoService.getCasosExito().subscribe((data) => {
      this.casosExito = data;
    });
  }
}
