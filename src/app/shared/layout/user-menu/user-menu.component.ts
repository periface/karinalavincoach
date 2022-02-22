import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';
@Component({
  templateUrl: './user-menu.component.html',
  selector: 'app-user-menu',
  styleUrls: ['./user-menu.component.scss'],
})
export class AppUserMenuComponent {
  userId: string | null;
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private localStorageService: LocalstorageService
  ) {
    let userId = this.localStorageService.getUserId;
    console.log(userId);
    if (userId) {
      this.userId = userId;
    } else {
      this.userId = '';
    }
  }
  async logOut() {
    await this.auth.signOut();
    this.localStorageService.clear();
    this.userId = '';
    this.router.navigateByUrl('auth');
  }
}
