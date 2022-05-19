import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { IUserSetting } from 'src/app/shared/services/firestore/types';

const defaultSettings = (): IUserSetting => ({
  location: {
    lat: null,
    lon: null,
    name: null,
  },
  attendanceTime: 930,
  notificationTime: 30,
});

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  loading = false;
  login: {
    email: string;
    password: string;
  } = {
    email: null,
    password: null,
  };

  constructor(public auth: AuthService, private firestore: FirestoreService) {}

  ngOnInit() {}

  signUp() {
    this.loading = true;
    this.auth
      .authSignUp(this.login)
      .then(() => {
        this.firestore.setUserSettings(this.auth.getUserId(), defaultSettings());
      })
      .finally(() => (this.loading = false));
  }
}
