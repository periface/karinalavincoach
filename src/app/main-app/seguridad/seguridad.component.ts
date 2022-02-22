import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangePasswordComponent } from './change-password-dialog/change-password.component';

@Component({
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.scss'],
})
export class SeguridadComponent {
  activeMediaQuery: string | undefined;
  width: string | undefined;
  /**
   *
   */
  constructor(
    private auth: AngularFireAuth,
    public dialog: MatDialog,
    private mediaObserver: MediaObserver,
    private snackbar: MatSnackBar
  ) {
    this.mediaObserver.asObservable().subscribe((change: MediaChange[]) => {
      change.forEach((item) => {
        this.activeMediaQuery = item
          ? `'${item.mqAlias}' = (${item.mediaQuery})`
          : '';
      });
      change[0].mqAlias === 'xs' ? (this.width = '100%') : (this.width = '50%');
    });
  }
  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: this.width,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((result: { success: any }) => {
      if (result.success) {
        //this.buildConstancia();
        this.snackbar.open('Contraseña actualizada correctamente', undefined, {
          duration: 3000,
        });
      }
    });
  }
}
