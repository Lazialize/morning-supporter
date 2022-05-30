import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { WeatherInfo } from 'src/app/shared/services/weather/types';
import { WeatherService } from 'src/app/shared/services/weather/weather.service';
import INotification from '../../shared/services/notification/interfaces/notification';
import { TaskService } from 'src/app/shared/services/task/task.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UserSettingService } from 'src/app/shared/services/user-setting/user-setting.service';
import { ITaskWithId } from 'src/app/shared/services/task/Interfaces/task';
import { IUserSetting } from 'src/app/shared/services/user-setting/interfaces/user-setting';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  tasks$: Observable<ITaskWithId[]>;
  weatherInfo$: Observable<WeatherInfo>;
  userSettings$: Observable<IUserSetting>;
  notifications$: Observable<INotification[]>;
  done: number;
  total: number;
  uncompletedTasks: ITaskWithId[];

  private progressSubscription: Subscription;

  constructor(
    private weather: WeatherService,
    private notification: NotificationService,
    private toastController: ToastController,
    private taskSrv: TaskService,
    private userSetting: UserSettingService,
  ) {
    this.progressSubscription = null;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.userSettings$ = this.userSetting.getObserver();
    this.weatherInfo$ = this.weather.getObserver();
    this.tasks$ = this.taskSrv.getObserver();
    this.notifications$ = this.notification.getObserver();

    this.progressSubscription = this.tasks$.subscribe((tasks) => {
      this.done = 0;
      this.total = 0;
      this.uncompletedTasks = [];
      for (const task of tasks) {
        if (task.isDone) {
          this.done++;
        } else {
          this.uncompletedTasks.push(task);
        }
        this.total++;
      }
    });
  }

  ngOnDestroy(): void {
    this.progressSubscription.unsubscribe();
  }

  onTaskClicked(task: ITaskWithId) {
    this.taskSrv.updateTask(task.id, { isDone: true }).then(() => {
      this.toastController
        .create({
          message: `${task.name}を完了しました。`,
          duration: 2000,
          position: 'top',
          buttons: [
            {
              text: '元に戻す',
              handler: () => this.taskSrv.updateTask(task.id, { isDone: false }),
            },
          ],
        })
        .then((toast) => toast.present());
    });
  }

  trackByFn(index, item: ITaskWithId) {
    return item.id;
  }
}
