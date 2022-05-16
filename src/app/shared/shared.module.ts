import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeolocationPage } from './pages/geolocation/geolocation.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  entryComponents: [GeolocationPage],
  declarations: [GeolocationPage],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SharedModule {}
