import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserSettingWithId } from 'src/app/shared/services/user-setting/interfaces/user-setting';

@Component({
  selector: 'app-temporary-task',
  templateUrl: './temporary-task.page.html',
  styleUrls: ['./temporary-task.page.scss'],
})
export class TemporaryTaskPage implements OnInit {
  tasks$: Observable<IUserSettingWithId>;

  constructor() {}

  ngOnInit() {}

  trackByFn(index, item) {
    return item.name;
  }
}
