import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonDatetime, IonPopover, ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { GeolocationPage } from 'src/app/shared/pages/geolocation/geolocation.page';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { IUserSetting } from 'src/app/shared/services/user-setting/interfaces/user-setting';
import { UserSettingService } from 'src/app/shared/services/user-setting/user-setting.service';
import { TemporaryTaskPage } from './temporary-task/temporary-task.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  @ViewChildren(IonDatetime) datetime: QueryList<IonDatetime>;
  @ViewChildren(IonPopover) popover: QueryList<IonPopover>;

  userSettings$: Observable<IUserSetting>;

  constructor(
    private auth: AuthService,
    private modalController: ModalController,
    private userSetting: UserSettingService,
  ) {}

  ngOnInit() {
    this.userSettings$ = this.userSetting.getObserver();
  }

  async openModal() {
    this.modalController
      .create({
        component: GeolocationPage,
      })
      .then((modal) => modal.present());
  }

  openTemporaryTaskModal() {
    this.modalController
      .create({
        component: TemporaryTaskPage,
        componentProps: {
          tasks$: this.userSettings$,
        },
      })
      .then((modal) => modal.present());
  }

  signOut() {
    this.auth.authSignOut();
  }

  notificationTimeChanged(event) {
    this.userSetting.updateUserSettings({
      notificationTime: Number(event.detail.value),
    });
  }

  confirm() {
    this.datetime
      .get(0)
      .confirm()
      .then(() => {
        const date = new Date(this.datetime.get(0).value);
        this.userSetting.updateUserSettings({
          attendanceTime: date.getHours() * 100 + date.getMinutes(),
        });
      });
    this.popover.get(0).dismiss();
  }

  close() {
    this.popover.get(0).dismiss();
  }

  getTimeText(time: number) {
    return `${Math.floor(time / 100)}:${time % 100}`;
  }
}
