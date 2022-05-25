import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { IUserSetting } from 'src/app/shared/services/user-setting/interfaces/user-setting';
import { UserSettingService } from 'src/app/shared/services/user-setting/user-setting.service';

const defaultSettings = (): IUserSetting => ({
  location: {
    lat: null,
    lon: null,
    name: null,
  },
  attendanceTime: 930,
  notificationTime: 30,
  temporaryTasks: [
    {
      name: '傘を鞄に入れる',
      tense: [0, 1],
      conditions: [2, 3, 5, 6],
    },
  ],
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

  constructor(public auth: AuthService, private userSetting: UserSettingService, private nav: NavController) {}

  ngOnInit() {}

  signUp() {
    this.loading = true;
    this.auth
      .authSignUp(this.login)
      .then(() => {
        this.userSetting.setUserSettings(defaultSettings());
      })
      .finally(() => (this.loading = false));
  }
}
