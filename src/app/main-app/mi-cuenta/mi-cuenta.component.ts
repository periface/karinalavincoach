import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { LocalstorageService } from 'src/app/shared/services/localstorage/localstorage.service';

@Component({
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.scss'],
})
export class MiCuentaComponent {
  // FORMULARIOS
  datosPersonalesForm: FormGroup | undefined;

  //CONDICIONALES ACADEMICO PROFESOR
  showIsProfesor = false;
  captureExternal = false;

  //CONDICIONALES ACADEMICO ESTUDIANTE
  showIsStudent = false;
  captureExternalStudent = false;

  //CONDICIONALES EMPRESARIAL
  showIsBusiness = false;
  sectorEconomicoEspecificar = false;

  privateUser: any;
  userId: string | null = null;
  @ViewChild('isProfesor') isProfesor: ElementRef | undefined;
  stepperOrientation: any;

  constructor(
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private breakPointObserver: BreakpointObserver,
    private localStorageService: LocalstorageService
  ) {
    this.stepperOrientation = this.breakPointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  async ngAfterViewInit() {
    this.userId = this.localStorageService.getUserId;

    if (this.userId) {
      this.privateUser = (
        await this.afs.collection('users').doc(this.userId).get().toPromise()
      ).data();
      if (this.privateUser) {
        this.buildPopulatedForm(this.privateUser);
      } else {
        this.buildEmptyForm();
      }
    }
  }
  private buildEmptyForm() {
    let nombreCompleto = this.privateUser
      ? this.privateUser.nombreCompleto
      : '';
    let email = this.privateUser ? this.privateUser.email : '';
    this.datosPersonalesForm = this.formBuilder.group({
      nombreCompleto: [
        nombreCompleto,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      email: [
        email,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      sexo: ['', Validators.required],
    });
  }
  private buildPopulatedForm(privateUser: any) {
    this.datosPersonalesForm = this.formBuilder.group({
      nombreCompleto: [
        privateUser.nombreCompleto,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      email: [
        privateUser.email,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      sexo: [privateUser.sexo, Validators.required],
    });

    this.showIsProfesor = privateUser.esProfesor == '1' ? true : false;
    this.captureExternal = privateUser.esProfesorEn == '2' ? true : false;
    this.showIsStudent = privateUser.esEstudiante == '1' ? true : false;
    this.captureExternalStudent =
      privateUser.esEstudianteEn == '2' ? true : false;
    this.showIsBusiness = privateUser.esEmpresario == '1' ? true : false;
    this.sectorEconomicoEspecificar =
      privateUser.sectorEconomico == '6' ? true : false;
  }
  async saveFirst() {
    try {
      let data = this.datosPersonalesForm?.value;
      await this.afs
        .collection('users')
        .doc(this.userId?.toString())
        .set(JSON.parse(JSON.stringify(data)), {
          merge: true,
        }); // G G CILLO
    } catch (error) {
      console.log(error);
    }
  }
  async finish() {
    try {
      let data = { registroFinalizado: true };
      await this.afs
        .collection('users')
        .doc(this.userId?.toString())
        .set(JSON.parse(JSON.stringify(data)), {
          merge: true,
        }); // G G CILLO
    } catch (error) {
      console.log(error);
    }
  }
}
