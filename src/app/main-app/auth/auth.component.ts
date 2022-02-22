import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
import { LocalStorageLocations } from 'src/app/shared/services/localstorage/localstorage.constants';
import validationMessages from 'src/app/shared/validation-messages/validation-messages';
import { ConfirmedValidator } from './confirm.validation';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent extends BaseComponent implements OnInit {
  showRegister = false;
  registerForm: FormGroup;
  recoverForm: FormGroup;
  currentActiveForm: FormGroup | undefined;
  returnUrl: string | undefined;
  loginForm: FormGroup;
  validationMessages = validationMessages.validationMessages;
  formActive = 'login';
  btnTxt = 'Iniciar Sesión';
  noAccountMsg = '¿No tienes cuenta?';
  callToAction = 'Registrate';
  topTxt = 'INICIO DE SESIÓN';
  registerAttempt: any;
  loading: boolean = false;
  ip: any;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    super();

    this.loginForm = this.formBuilder.group({
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      contrasena: ['', Validators.required],
    });

    this.registerForm = this.formBuilder.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        correo: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        contrasena: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'
            ),
          ],
        ],
        confirmarContrasena: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('contrasena', 'confirmarContrasena'),
      }
    );
    this.recoverForm = this.formBuilder.group({
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]+$'),
        ],
      ],
    });
    this.currentActiveForm = this.loginForm;
    this.returnUrl = this.activatedRoute.snapshot.params.returnUrl;
    this.registerAttempt = this.activatedRoute.snapshot.params.registerAttempt;
  }
  async ngOnInit() {
    this.ip = await this.getIPAddress();
  }
  async showMessage(message: string) {
    try {
      this.snackBar.open(message, undefined, {
        duration: 3000,
        verticalPosition: 'top',
      });
    } catch (error) {}
  }
  async handleLoginForm() {
    this.loading = true;
    let text = this.btnTxt;
    switch (this.formActive) {
      case 'login':
        this.btnTxt = 'Iniciando sesión...';

        await this.waitFor(2000);
        await this.login();
        break;
      case 'register':
        this.btnTxt = 'Creando usuario...';

        await this.waitFor(2000);
        await this.register();
        break;
      case 'recover':
        await this.waitFor(2000);
        await this.recover();
        break;
      default:
        return;
    }
    this.loading = false;
    this.btnTxt = text;
  }
  async login() {
    try {
      let userCredentials = await this.auth.signInWithEmailAndPassword(
        this.loginForm.value.correo,
        this.loginForm.value.contrasena
      );
      if (userCredentials.user) {
        this.localStorageService.setItem(
          LocalStorageLocations.USER_ID,
          userCredentials.user.uid
        );
        let userRegisterInfo = await this.afs
          .collection('users')
          .doc(userCredentials.user.uid)
          .get()
          .toPromise();

        this.localStorageService.setItem(
          LocalStorageLocations.USER_ACCOUNT_INFO,
          JSON.stringify(userRegisterInfo.data())
        );
        this.router.navigateByUrl('panel-de-control');
      }
    } catch (error) {
      this.showMessage('Usuario/contraseña incorrectos');
    }
  }
  getFormActive() {
    switch (this.formActive) {
      case 'login':
        this.currentActiveForm = this.loginForm;
        return this.loginForm;
      case 'register':
        this.currentActiveForm = this.registerForm;
        return this.registerForm;
      case 'recover':
        this.currentActiveForm = this.recoverForm;
        return this.recoverForm;
      default:
        this.currentActiveForm = this.loginForm;
        return this.loginForm;
    }
  }
  async register() {
    try {
      let userCredentials = await this.auth.createUserWithEmailAndPassword(
        this.registerForm.value.correo,
        this.registerForm.value.contrasena
      );
      await this.afs
        .collection('users')
        .doc(userCredentials.user?.uid)
        .set({
          email: this.registerForm.value.correo,
          nombreCompleto: this.registerForm.value.nombre,
          registerDate: new Date(Date.now()),
          registerIp: this.ip,
        });
      if (userCredentials.user) {
        this.localStorageService.setItem(
          LocalStorageLocations.USER_ID,
          userCredentials.user.uid
        );
        this.localStorageService.setItem(
          LocalStorageLocations.USER_ACCOUNT_INFO,
          JSON.stringify({
            email: this.registerForm.value.correo,
            nombreCompleto: this.registerForm.value.nombre,
          })
        );
        this.router.navigateByUrl('panel-de-control');
      } else {
        this.showMessage('No se encontro al usuario');
      }
    } catch (error) {
      this.showMessage(JSON.stringify(error));
    }
  }
  redirect() {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(['panel-de-control']);
    }
  }
  async recover() {
    try {
      await this.auth.sendPasswordResetEmail(this.recoverForm.value.correo);
      this.showMessage(
        'Correo de recuperación enviado: ' + this.recoverForm.value.correo
      );
      this.toggleForm('login');
    } catch (error) {
      this.showMessage(JSON.stringify(error));
    }
  }
  toggleForm(form: string) {
    this.formActive = form;
    switch (form) {
      case 'login':
        this.btnTxt = 'Iniciar Sesión';
        this.noAccountMsg = '¿No tienes cuenta?';
        this.callToAction = 'Registrate';
        this.topTxt = 'INICIO DE SESIÓN';
        break;
      case 'register':
        this.btnTxt = 'Registrarse';
        this.callToAction = 'Inicia sesión';
        this.noAccountMsg = '¿Ya tienes cuenta?';
        this.topTxt = 'REGISTRO';
        break;
      case 'recover':
        this.btnTxt = 'Enviar correo de recuperación';
        this.callToAction = 'Inicia sesión';
        this.noAccountMsg = '¿Ya tienes cuenta?';
        this.topTxt = 'RECUPERACIÓN DE CONTRASEÑA';
        break;
      default:
        this.btnTxt = 'Iniciar Sesión';
        this.noAccountMsg = '¿No tienes cuenta?';
        this.callToAction = 'Registrate';
        this.topTxt = 'INICIO DE SESIÓN';
        break;
    }
  }
  handleError(error: any) {
    //console.log(error);
  }
  async useExternal(external: string) {
    try {
      var userCredentials = await this.auth.signInWithPopup(
        external == 'facebook'
          ? new firebase.default.auth.FacebookAuthProvider()
          : new firebase.default.auth.GoogleAuthProvider()
      );
      await this.afs.collection('users').doc(userCredentials.user?.uid).set(
        {
          email: userCredentials.user?.email,
          nombreCompleto: userCredentials.user?.displayName,
        },
        { merge: true }
      );

      if (userCredentials.user) {
        this.localStorageService.setItem(
          LocalStorageLocations.USER_ID,
          userCredentials.user.uid
        );
        this.localStorageService.setItem(
          LocalStorageLocations.USER_ACCOUNT_INFO,
          JSON.stringify({
            email: userCredentials.user?.email,
            nombreCompleto: userCredentials.user?.displayName,
          })
        );
        this.router.navigateByUrl('panel-de-control');
      } else {
        this.showMessage('No se encontro al usuario');
      }
    } catch (error) {
      this.showMessage('Error en el registro intentelo más tarde');
    }
  }
}
