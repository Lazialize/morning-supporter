import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/shared/firestore/firestore.service';
import { ITaskWithId } from 'src/app/shared/firestore/types';
import { WeatherService } from 'src/app/shared/weather/weather.service';

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

  constructor(
    readonly weatherInfo$: WeatherService,
    private firestore: FirestoreService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.weatherInfo$.subscribe((weatherInfo) => console.log(weatherInfo));
  }

  ionViewWillEnter() {
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
