import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
import { RutinaService } from 'src/app/shared/services/rutinas/rutina.service';
@Component({
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.scss'],
})
export class RoutinesComponent extends BaseComponent implements OnInit {
  rutinas: any[] = [];
  /**
   *
   */
  constructor(private rutinasService: RutinaService) {
    super();
  }
  ngOnInit(): void {
    this.rutinasService.getAll().subscribe((data) => {
      console.log(data);
      this.rutinas = data;
    });
  }
}
