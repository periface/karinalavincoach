import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExcerciseComponent } from './add-excercise.component';

describe('AddExcerciseComponent', () => {
  let component: AddExcerciseComponent;
  let fixture: ComponentFixture<AddExcerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExcerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExcerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
