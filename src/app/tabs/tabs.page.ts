import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import notifications from '../shared/constants/notifications';
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

  constructor(
    private auth: AuthService,
    private task: TaskService,
    private weather: WeatherService,
    private notification: NotificationService,
    private userSetting: UserSettingService,
  ) {}

  ngOnInit(): void {
    this.weather.initialize();
    this.notification.initialize();
    this.task.initialize(this.auth.getUserId());
    this.userSetting.initialize(this.auth.getUserId());

    this.subscriptionWeatherUpdated = this.weather.getObserver().subscribe((weatherInfo) => {
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
      this.temporaryTaskProcess(futureWeatherId, true);
    });
  }

  ngOnDestroy(): void {
    this.subscriptionWeatherUpdated.unsubscribe();
  }

  private temporaryTaskProcess(weatherId: number, isFuture = false) {
    this.userSetting
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
