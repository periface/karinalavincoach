import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarEjercicioComponent } from './generar-ejercicio.component';

describe('GenerarEjercicioComponent', () => {
  let component: GenerarEjercicioComponent;
  let fixture: ComponentFixture<GenerarEjercicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarEjercicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarEjercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
