import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';

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
        this.firestore.setUserSettings(this.auth.getUserId(), {
          location: {
            lat: null,
            lon: null,
            name: null,
          },
          attendanceTime: null,
        });
      })
      .finally(() => (this.loading = false));
  }
}
