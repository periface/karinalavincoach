import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperationType } from 'firebase/auth';
import { BaseComponent } from 'src/app/shared/components/base-component.component';
import { CustomValidators } from '../../auth/confirm.validation';
@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
  /**
   *
   */

  formGrp: FormGroup;
  isPasswordCorrect: boolean | undefined;
  loading: boolean | undefined;
  message: string | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private auth: AngularFireAuth
  ) {
    super();
    this.formGrp = this.formBuilder.group(
      {
        originalPassword: [, Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      (formGroup: FormGroup) => {
        return CustomValidators.areEqual(formGroup);
      }
    );
  }
  ngOnInit(): void {}
  async onOkClick() {
    try {
      this.loading = true;
      this.isPasswordCorrect = await this.testOriginalPassword();
      if (!this.isPasswordCorrect) {
        this.loading = false;
        throw new Error('INCORRECT_PASSWORD');
      } else {
        let subscription = this.auth.user.subscribe(
          async (user) => {
            if (user) {
              await user.updatePassword(this.formGrp.value.newPassword);
              this.dialogRef.close({ success: true });
              this.loading = false;
            }
            this.loading = false;
            subscription.unsubscribe();
          },
          () => {
            this.message = 'Error intentelo más tarde';
            throw new Error('FIREBASE_ERROR');
          }
        );
      }
    } catch (error: any) {
      this.message = 'Contraseña incorrecta';
      this.loading = false;
    }
  }
  async testOriginalPassword() {
    try {
      let result = await this.auth.signInWithEmailAndPassword(
        this.localStorageService.userData.email,
        this.formGrp.value.originalPassword
      );
      if (result.operationType == OperationType.SIGN_IN) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
