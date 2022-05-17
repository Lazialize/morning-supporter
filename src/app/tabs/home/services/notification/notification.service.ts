import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Color } from './enums/color';
import { Icon } from './enums/icon';
import { Tense } from './enums/tense';
import INotification from './interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: Subject<INotification[]>;
  private notificationCollection: INotification[];

  private readonly conditions = {
    2: '雷雨',
    3: '霧雨',
    5: '雨',
    6: '雪',
  };

  constructor() {
    this.notifications = new Subject<INotification[]>();
    this.notificationCollection = [];
  }

  initialize(): void {
    this.notificationCollection = [];
    this.notifications.next(this.notificationCollection);
  }

  getNotifications(): Observable<INotification[]> {
    return this.notifications.asObservable();
  }

  addNotification(tense: Tense, icon: Icon, color: Color, weatherId: number): boolean {
    const condition = this.conditions[Math.floor(weatherId / 100)];

    if (!condition) {
      return false;
    }

    this.notificationCollection.push({
      icon: icon.toString(),
      color: color.toString(),
      message: tense === Tense.current ? `現在，${condition}が降っています。` : `今日は${condition}が降る予定です。`,
    });
    this.notifications.next(this.notificationCollection);
    return true;
  }

  addCurrentNotification(weatherId: number): boolean {
    return this.addNotification(Tense.current, Icon.alert, Color.danger, weatherId);
  }

  addFutureNotification(weatherId: number): boolean {
    return this.addNotification(Tense.future, Icon.warning, Color.warning, weatherId);
  }
}
