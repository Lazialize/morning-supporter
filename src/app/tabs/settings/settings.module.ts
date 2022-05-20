import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { TemporaryTaskPage } from './temporary-task/temporary-task.page';

@NgModule({
  entryComponents: [TemporaryTaskPage],
  imports: [CommonModule, FormsModule, IonicModule, SettingsPageRoutingModule],
  declarations: [SettingsPage, TemporaryTaskPage],
})
export class SettingsPageModule {}
