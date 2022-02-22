import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoginInput } from '../models/account.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   *
   */
  constructor(public afAuth: AngularFireAuth) {}
  login(loginInput: LoginInput): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(
      loginInput.email,
      loginInput.password
    );
  }
  logout() {
    this.afAuth.signOut();
  }
}
