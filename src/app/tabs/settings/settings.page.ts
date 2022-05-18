import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonDatetime, IonPopover, ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GeolocationPage } from 'src/app/shared/pages/geolocation/geolocation.page';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { IUserSetting } from 'src/app/shared/services/firestore/types';

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
    private firestore: FirestoreService,
  ) {}

  ngOnInit() {
    this.userSettings$ = this.firestore.getUserSettingsById(this.auth.getUserId());
  }

  async openModal() {
    this.modalController
      .create({
        component: GeolocationPage,
      })
      .then((modal) => modal.present());
  }

  signOut() {
    this.auth.authSignOut();
  }

  confirm() {
    this.datetime
      .get(0)
      .confirm()
      .then(() => {
        const date = new Date(this.datetime.get(0).value);
        this.firestore.updateUserSettings(this.auth.getUserId(), {
          attendanceTime: date.getHours() * 100 + date.getMinutes(),
        });
      });
    this.popover.get(0).dismiss();
  }

  close() {
    this.popover.get(0).dismiss();
  }
}
