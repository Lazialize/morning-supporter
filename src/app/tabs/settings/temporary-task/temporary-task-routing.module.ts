import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemporaryTaskPage } from './temporary-task.page';

const routes: Routes = [
  {
    path: '',
    component: TemporaryTaskPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemporaryTaskPageRoutingModule {}
