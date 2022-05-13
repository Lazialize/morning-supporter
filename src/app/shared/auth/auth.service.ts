import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AlertController, NavController } from '@ionic/angular';
import { firebaseError } from './firebase.error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private navController: NavController, private alertController: AlertController) {}

  authSignUp(login: { email: string; password: string }) {
    return createUserWithEmailAndPassword(this.auth, login.email, login.password)
      .then(() => this.navController.navigateForward('/'))
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  authSignIn(login: { email: string; password: string }) {
    return signInWithEmailAndPassword(this.auth, login.email, login.password)
      .then(() => this.navController.navigateForward('/'))
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  authSignOut() {
    return signOut(this.auth)
      .then(() => this.navController.navigateRoot('/auth/signin'))
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  async alertError(e) {
    if (firebaseError.hasOwnProperty(e.code)) {
      e = firebaseError[e.code];
    }
    const alert = await this.alertController.create({
      header: e.code,
      message: e.message,
      buttons: ['閉じる'],
    });
    await alert.present();
  }
}
