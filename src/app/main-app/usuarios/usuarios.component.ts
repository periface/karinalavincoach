import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
@Component({
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class UsuariosComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  users: any[] = [];
  subscription: Subscription | undefined;
  dataSourceMat = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: any;
  expandedElement: any;
  displayedColumns = ['nombreCompleto', 'email', 'ciudad', 'estado'];
  currentUserTokens: any[] = [];
  /**
   *
   */
  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
    super();
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    this.subscription = this.afs
      .collection('users')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return {
              id,
              ...data,
            };
          })
        )
      )
      .subscribe(
        (response) => {
          this.users = response;
          this.dataSourceMat.data = this.users;
          this.dataSourceMat.paginator = this.paginator;
        },
        (error) => {}
      );
  }
  saveRole(user: any) {
    this.afs.collection('users').doc(user.id).set(user, { merge: true });
  }
  getFcm(userId: string) {
    this.afs
      .collection('fcmTokens', (ref) => ref.where('user', '==', userId))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return {
              id,
              ...data,
            };
          })
        )
      )
      .subscribe((data) => {
        console.log(data);
        this.currentUserTokens = data;
      });
  }
  openDetails(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
    this.getFcm(row.id);
  }
}
