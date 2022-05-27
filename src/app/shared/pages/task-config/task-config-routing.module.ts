import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskConfigPage } from './task-config.page';

const routes: Routes = [
  {
    path: '',
    component: TaskConfigPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskConfigPageRoutingModule {}
