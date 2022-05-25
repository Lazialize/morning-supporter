import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeolocationPage } from './pages/geolocation/geolocation.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateTaskPage } from './pages/create-task/create-task.page';

@NgModule({
  entryComponents: [GeolocationPage],
  declarations: [GeolocationPage, CreateTaskPage],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SharedModule {}
