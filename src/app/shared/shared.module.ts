import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeolocationPage } from './pages/geolocation/geolocation.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateTaskPage } from './pages/create-task/create-task.page';
import { TaskConfigPage } from './pages/task-config/task-config.page';

@NgModule({
  entryComponents: [GeolocationPage],
  declarations: [GeolocationPage, CreateTaskPage, TaskConfigPage],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SharedModule {}
