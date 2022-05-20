import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Color } from './enums/color';
import { Icon } from './enums/icon';
import INotification from './interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private subject: Subject<INotification[]>;
  private notifications: INotification[];

  constructor() {
    this.notifications = [];
    this.subject = new Subject<INotification[]>();
  }

  getObserver(): Observable<INotification[]> {
    return this.subject.asObservable();
  }

  initialize(): void {
    this.notifications = [];
    this.subject.next(null);
  }

  addNotification(notification: INotification) {
    this.notifications = [...this.notifications, notification];
    this.subject.next(this.notifications);
  }
}
