import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { ITaskWithId, IUserSetting } from 'src/app/shared/services/firestore/types';
import { WeatherInfo } from 'src/app/shared/services/weather/types';
import { WeatherService } from 'src/app/shared/services/weather/weather.service';
import INotification from './services/notification/interfaces/notification';
import { NotificationService } from './services/notification/notification.service';

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
  ) {
    this.userSettingSubscription = null;
    this.notificationSubscription = null;
    this.progressSubscription = null;
  }

  ngOnInit(): void {
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
          this.weather.updateWeatherInformation(+settings.location.lat, +settings.location.lon);
        });
      },
    );

    this.notificationSubscription = this.weatherInfo$.subscribe((weatherInfo) => {
      if (this.notification.addCurrentNotification(weatherInfo.current.weather[0].id)) {
        return;
      }

      this.notification.addFutureNotification(weatherInfo.daily[0].weather[0].id);
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
