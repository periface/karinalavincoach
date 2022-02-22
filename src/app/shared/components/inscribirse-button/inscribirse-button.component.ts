import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base-component.component';

@Component({
  templateUrl: './inscribirse-button.component.html',
  selector: 'app-inscribirse-button',
  styleUrls: ['./inscribirse-button.component.scss'],
})
export class InscribirseButtonComponent
  extends BaseComponent
  implements OnInit
{
  /**
   *
   */
  @Input('conferenciaId') conferenciaId: string | undefined;
  @Input('conferenciaImg') conferenciaImg: string | undefined;
  @Input('conferenciaName') conferenciaName: string | undefined;
  @Input('isFinished') isFinished: string | undefined;
  @Input('redirect') redirect = false;
  @Input('showMyCourses') showMyCourses = false;
  @Output('subscribe') subscribe: EventEmitter<any> = new EventEmitter();
  disabled = true;
  buttonTxt = '¡Inscribete ahora!';
  userId: string | null | undefined;
  loading: boolean = false;
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  ngOnInit(): void {
    if (this.isFinished) {
      return;
    } else {
      this.userId = this.localStorageService.getUserId;
      let subscription = this.afs
        .collection('registrations', (ref) => {
          let query = ref.where('userId', '==', this.userId);
          query = query.where('courseId', '==', this.conferenciaId);
          return query;
        })
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        )
        .subscribe((data) => {
          let inscripcion = data[0];
          if (inscripcion) {
            this.disabled = true;
            this.buttonTxt = 'Ya estas inscrito';
          } else {
            this.disabled = false;
            this.buttonTxt = '¡Inscríbete ahora!';
          }
          subscription.unsubscribe();
        });
    }
  }
  showMessage() {
    let ref = this.snackBar.open(
      '¡Ya te has inscrito al curso!',
      'Ver mis cursos',
      {
        duration: 3000,
        verticalPosition: 'top',
      }
    );
    ref.onAction().subscribe(() => {
      this.router.navigateByUrl('/users/dashboard/miscursos');
    });
  }
  async subscribeToCourse() {
    try {
      if (!this.localStorageService.surveyFinished) {
        this.router.navigateByUrl('/users/mainform');
        return;
      }
      let text = this.buttonTxt;
      this.loading = true;
      this.buttonTxt = 'Cargando tus datos...';
      if (!this.userId) {
        this.router.navigate(['auth', { registerAttempt: true }]);
        return;
      }
      await this.waitFor(1000);
      let userData = await this.afs
        .collection('users')
        .doc(this.userId?.toString())
        .get()
        .toPromise();
      this.buttonTxt = 'Apartando lugar...';
      var registrationData = {
        userId: this.userId,
        courseId: this.conferenciaId,
        courseImg: this.conferenciaImg,
        courseName: this.conferenciaName,
        registrationDate: new Date(Date.now()),
        registrationData: userData.data(),
        registrationIp: await this.getIPAddress(),
      };
      this.afs
        .collection('registrations')
        .doc(this.afs.createId())
        .set(registrationData);
      await this.waitFor(1000);
      this.subscribe.emit({ status: 'success', registrationData });

      this.snackBar.open('¡Te has inscrito al curso!', '', {
        duration: 3000,
      });
      this.buttonTxt = 'Ya estas inscrito';
      this.disabled = true;
      this.buttonTxt = text;
      this.loading = false;
      if (this.redirect) {
        this.router.navigateByUrl('users/dashboard/miscursos');
      }
    } catch (error) {
      console.log('Error', error);
      console.log('Intentando arreglar mi desastre');
    }
  }
}
