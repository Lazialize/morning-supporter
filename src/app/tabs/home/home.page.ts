import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { GeolocationPage } from 'src/app/shared/pages/geolocation/geolocation.page';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { ITaskWithId, IUserSetting } from 'src/app/shared/services/firestore/types';
import { WeatherInfo } from 'src/app/shared/services/weather/types';
import { WeatherService } from 'src/app/shared/services/weather/weather.service';
import INotification from './services/notification/interfaces/notification';
import { NotificationService } from './services/notification/notification.service';
import { LocalNotifications } from '@capacitor/local-notifications';

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
    private auth: AuthService,
    private weather: WeatherService,
    private notification: NotificationService,
    private firestore: FirestoreService,
    private toastController: ToastController,
    private modalController: ModalController,
  ) {
    this.userSettingSubscription = null;
    this.notificationSubscription = null;
    this.progressSubscription = null;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.weather.initializeWeatherInfo();
    this.notification.initialize();

    this.userSettings$ = this.firestore.getUserSettingsById(this.auth.getUserId());
    this.weatherInfo$ = this.weather.getWeatherInfo();
    this.tasks$ = this.firestore.fetchAllTask();
    this.notifications$ = this.notification.getNotifications();

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

          if (settings.attendanceTime !== null) {
            const minute =
              settings.attendanceTime % 100 >= 30 ? settings.attendanceTime - 30 : 60 - (30 - settings.attendanceTime);
            const hour =
              settings.attendanceTime - 30 === minute
                ? Math.floor(settings.attendanceTime / 100)
                : Math.floor(settings.attendanceTime / 100) - 1;
            LocalNotifications.requestPermissions();
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
      },
    );

    this.notificationSubscription = this.weatherInfo$.subscribe((weatherInfo) => {
      console.log(weatherInfo);
      this.notification.initialize();
      if (this.notification.addCurrentNotification(weatherInfo.current.weather[0].id)) {
        this.firestore
          .fetchTempTaskByName(this.auth.getUserId(), '傘を持っていく')
          .pipe(first())
          .forEach((tasks) => {
            if (tasks.length > 0) {
              return;
            }
            this.firestore.addTask({
              name: '傘を持っていく',
              uid: this.auth.getUserId(),
              timestamp: Date.now(),
              isDone: false,
              isTemporary: true,
            });
          });
        return;
      } else if (this.notification.addFutureNotification(weatherInfo.daily[0].weather[0].id)) {
        this.firestore
          .fetchTempTaskByName(this.auth.getUserId(), '傘を鞄に入れる')
          .pipe(first())
          .forEach((tasks) => {
            if (tasks.length > 0) {
              return;
            }
            this.firestore.addTask({
              name: '傘を鞄に入れる',
              uid: this.auth.getUserId(),
              timestamp: Date.now(),
              isDone: false,
              isTemporary: true,
            });
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
    this.firestore.updateTask(task.id, { isDone: true }).then(async () => {
      const toast = await this.toastController.create({
        message: `${task.name}を完了しました。`,
        duration: 3000,
        buttons: [
          {
            text: '元に戻す',
            handler: () => this.firestore.updateTask(task.id, { isDone: false }),
          },
        ],
      });
      toast.present();
    });
  }
}
