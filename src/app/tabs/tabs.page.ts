import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import notifications from '../shared/constants/notifications';
import { GeolocationPage } from '../shared/pages/geolocation/geolocation.page';
import { AuthService } from '../shared/services/auth/auth.service';
import { NotificationService } from '../shared/services/notification/notification.service';
import { TaskService } from '../shared/services/task/task.service';
import { UserSettingService } from '../shared/services/user-setting/user-setting.service';
import { WeatherService } from '../shared/services/weather/weather.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  private subscriptionWeatherUpdated: Subscription;
  private subscriptionSettingsUpdated: Subscription;
  private subscriptionWeatherSettingsUpdated: Subscription;

  constructor(
    private auth: AuthService,
    private task: TaskService,
    private weather: WeatherService,
    private notification: NotificationService,
    private userSetting: UserSettingService,
    private modalController: ModalController,
    private alert: AlertController,
    private toast: ToastController,
  ) {}

  ngOnInit(): void {
    this.weather.initialize();
    this.notification.initialize();
    this.task.initialize(this.auth.getUserId());
    this.userSetting.initialize(this.auth.getUserId());

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.weather.updateWeatherInformation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        this.subscriptionWeatherSettingsUpdated = this.userSetting.getObserver().subscribe((settings) => {
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

    this.subscriptionWeatherUpdated = this.weather.getObserver().subscribe(async (weatherInfo) => {
      this.notification.initialize();

      const currentWeatherId = Math.floor(weatherInfo.current.weather[0].id / 100);
      const currentNotification = notifications.current[currentWeatherId];
      const futureWeatherId = Math.floor(weatherInfo.daily[0].weather[0].id / 100);
      const futureNotification = notifications.future[futureWeatherId];

      if (currentNotification) {
        this.notification.addNotification(currentNotification);
      } else if (futureNotification) {
        this.notification.addNotification(futureNotification);
      }

      this.temporaryTaskProcess(currentWeatherId);
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.temporaryTaskProcess(futureWeatherId, true);
    });

    this.subscriptionSettingsUpdated = this.userSetting.getObserver().subscribe((settings) => {
      const attendanceMinute = settings.attendanceTime % 100;
      const attendanceHour = Math.floor(settings.attendanceTime / 100);

      const notificationTime = settings.notificationTime;

      let hour: number;
      let minute: number;

      if (notificationTime % 60 === 0) {
        const resHour = attendanceHour - (notificationTime % 60);
        hour = resHour < 0 ? 24 + resHour : resHour;
        minute = attendanceMinute;
      } else {
        let resHour = attendanceHour - Math.floor(notificationTime / 60);
        const resMinute = attendanceMinute - (notificationTime % 60);

        minute = resMinute < 0 ? 60 + resMinute : resMinute;
        if (resMinute < 0) {
          resHour -= 1;
        }
        hour = resHour < 0 ? 24 + resHour : resHour;
      }

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
    });
  }

  ngOnDestroy(): void {
    this.subscriptionWeatherUpdated.unsubscribe();
    this.subscriptionSettingsUpdated.unsubscribe();
    this.subscriptionWeatherSettingsUpdated.unsubscribe();
  }

  async openAlertToCreateTask() {
    const alert = await this.alert.create({
      header: '日課の作成',
      inputs: [
        {
          name: 'name',
          placeholder: '日課の名称',
        },
      ],
      buttons: [
        {
          text: '閉じる',
        },
        {
          text: '作成',
          handler: (data: { name: string }) => {
            this.task.addTask(data).then(() => this.popToast(`「${data.name}」を追加しました。`));
          },
        },
      ],
    });
    alert.present();
  }

  private popToast(message: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'top') {
    this.toast
      .create({
        message,
        duration,
        position,
      })
      .then((toast) => toast.present());
  }

  private temporaryTaskProcess(weatherId: number, isFuture = false) {
    return this.userSetting
      .getObserver()
      .pipe(first())
      .forEach(async (userSetting) => {
        if (!userSetting.temporaryTasks) {
          return;
        }

        for (const taskSetting of userSetting.temporaryTasks) {
          if (!taskSetting.conditions.includes(weatherId)) {
            continue;
          }
          if (!taskSetting.tense.includes(Number(isFuture))) {
            continue;
          }
          if (await this.task.isTemporaryTaskExists(taskSetting.name)) {
            continue;
          }

          this.task.addTask({ name: taskSetting.name }, true);
        }
      });
  }
}
