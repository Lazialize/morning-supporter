import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { GeolocationPage } from 'src/app/shared/pages/geolocation/geolocation.page';
import { WeatherInfo } from 'src/app/shared/services/weather/types';
import { WeatherService } from 'src/app/shared/services/weather/weather.service';
import INotification from '../../shared/services/notification/interfaces/notification';
import { LocalNotifications } from '@capacitor/local-notifications';
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

  private userSettingSubscription: Subscription;
  private notificationSubscription: Subscription;
  private progressSubscription: Subscription;

  constructor(
    private weather: WeatherService,
    private notification: NotificationService,
    private toastController: ToastController,
    private modalController: ModalController,
    private taskSrv: TaskService,
    private userSetting: UserSettingService,
  ) {
    this.userSettingSubscription = null;
    this.notificationSubscription = null;
    this.progressSubscription = null;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.userSettings$ = this.userSetting.getObserver();
    this.weatherInfo$ = this.weather.getObserver();
    this.tasks$ = this.taskSrv.getObserver();
    this.notifications$ = this.notification.getObserver();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.weather.updateWeatherInformation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        this.userSettingSubscription = this.userSettings$.subscribe((settings) => {
          if (settings.location.lat === null || settings.location.lon === null || settings.location.name === null) {
            this.modalController
              .create({
                component: GeolocationPage,
              })
              .then((modal) => modal.present());
          } else {
            this.weather.updateWeatherInformation(+settings.location.lat, +settings.location.lon);
          }
        });
      },
      {
        timeout: 1000,
      },
    );

    this.userSettings$.subscribe((settings) => {
      if (settings.attendanceTime !== null) {
        const attendanceMinute = settings.attendanceTime % 100;
        const attendanceHour = Math.floor(settings.attendanceTime / 100);

        const minute = attendanceMinute >= 30 ? attendanceMinute - 30 : 60 - (30 - attendanceMinute);
        const hour = attendanceMinute - 30 === minute ? attendanceHour : attendanceHour - 1;

        LocalNotifications.requestPermissions();
        LocalNotifications.cancel({
          notifications: [{ id: 1 }],
        });
        LocalNotifications.schedule({
          notifications: [
            {
              id: 1,
              title: '出勤時間30分前',
              body: '朝のタスクは完了しましたか？',
              schedule: {
                on: {
                  hour,
                  minute,
                },
              },
            },
          ],
        });
      }
    });

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
    console.log('ngOnDestroyed');
    this.userSettingSubscription.unsubscribe();
    this.notificationSubscription.unsubscribe();
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
