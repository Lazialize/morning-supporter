import { Component, OnInit } from '@angular/core';
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

  constructor(readonly weatherInfo$: WeatherService, private firestore: FirestoreService) {}

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
}
