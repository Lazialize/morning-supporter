import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeolocationPage } from 'src/app/shared/pages/geolocation/geolocation.page';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(private auth: AuthService, private modalController: ModalController) {}

  ngOnInit() {}

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
}
