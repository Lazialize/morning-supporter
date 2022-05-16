import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { ITaskWithId } from 'src/app/shared/services/firestore/types';
import { WeatherService } from 'src/app/shared/services/weather/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  tasks$: Observable<ITaskWithId[]>;
  done: number;
  total: number;
  uncompletedTasks: ITaskWithId[];
  notifications: {
    color: string;
    icon: string;
    message: string;
  }[];

  constructor(
    readonly weatherInfo$: WeatherService,
    private firestore: FirestoreService,
    private toastController: ToastController,
  ) {
    this.notifications = [];
  }

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.weatherInfo$.subscribe((weatherInfo) => {
      this.notifications = [];
      let weatherId = Math.floor(weatherInfo.current.weather[0].id / 100);

      let icon = 'alert-circle-outline';
      let color = 'danger';
      if (weatherId === 2) {
        this.notifications.push({ icon, color, message: '現在，雷雨が降っています。' });
      } else if (weatherId === 3) {
        this.notifications.push({ icon, color, message: '現在，霧雨が降っています。' });
      } else if (weatherId === 5) {
        this.notifications.push({ icon, color, message: '現在，雨が降っています。' });
      } else if (weatherId === 6) {
        this.notifications.push({ icon, color, message: '現在，雪が降っています。' });
      }

      weatherId = Math.floor(weatherInfo.daily[0].weather[0].id / 100);
      icon = 'alert-outline';
      color = 'warning';
      if (weatherId === 2) {
        this.notifications.push({ icon, color, message: '今日は雷雨が降る予定です。' });
      } else if (weatherId === 3) {
        this.notifications.push({ icon, color, message: '今日は霧雨が降る予定です。' });
      } else if (weatherId === 5) {
        this.notifications.push({ icon, color, message: '今日は雨が降る予定です。' });
      } else if (weatherId === 6) {
        this.notifications.push({ icon, color, message: '今日は雪が降る予定です。' });
      }
    });

    this.tasks$ = this.firestore.fetchAllTask();
    this.tasks$.subscribe((tasks) => {
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
