import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
@Component({
  templateUrl: './create-edit-routine.component.html',
  styleUrls: ['./create-edit-routine.component.scss'],
})
export class CreateRoutineComponent extends BaseComponent {
  /**
   *
   */
  formGroup: FormGroup;
  constructor(private afs: AngularFirestore, private formBuilder: FormBuilder) {
    super();
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      pesoMin: ['', Validators.required],
      pesoMax: ['', Validators.required],
      estaturaMin: ['', Validators.required],
      estaturaMax: ['', Validators.required],
      description: [''],
      duracion: [''],
    });
  }
  save() {
    console.log(this.formGroup.value);
  }
}
