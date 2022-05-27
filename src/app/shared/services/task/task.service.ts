import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { WeatherInfo } from '../weather/types';
import { ConditionType, IDayOfWeekCondition } from './Interfaces/condition';
import { IPartialTask, ITask, ITaskUpdateData, ITaskWithId } from './Interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private subscription: Subscription;
  private observer$: Observable<ITaskWithId[]>;
  private subject: Subject<ITaskWithId[]>;
  private taskCollection: CollectionReference<ITask>;
  private actualTasks: ITaskWithId[];

  private userId: string;

  constructor(private firestore: Firestore) {
    this.taskCollection = collection(this.firestore, 'tasks') as CollectionReference<ITask>;
    this.subject = new Subject<ITaskWithId[]>();
    this.observer$ = null;
    this.subscription = null;
  }

  initialize(userId: string): void {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }

    this.userId = userId;
    this.observer$ = collectionData(
      query(this.taskCollection, orderBy('timestamp', 'asc'), where('uid', '==', userId)),
      { idField: 'id' },
    ) as Observable<ITaskWithId[]>;

    this.observer$.subscribe((tasks) => {});

    this.actualTasks = [];
    this.subject.next(this.actualTasks);
  }

  getObserver(): Observable<ITaskWithId[]> {
    return this.subject.asObservable();
  }

  updateTasksConditions(weatherInfo: WeatherInfo) {
    this.observer$.pipe(first()).forEach((tasks) => {
      const newTaskArray: ITaskWithId[] = [];
      for (const task of tasks) {
        if (!task.isTemporary) {
          newTaskArray.push(task);
          continue;
        }

        if (task.temporaryCondition.conditionType === ConditionType.dayOfWeek) {
          const now = new Date(Date.now());
          const condition = task.temporaryCondition.conditions as IDayOfWeekCondition;
          if (condition.isOrdinal) {
            const dayOfWeek = condition.dayOfWeeks as {
              ordinal: number;
              dayOfWeek: number;
            };
            if (now.getDay() !== dayOfWeek.dayOfWeek) {
              continue;
            }

            if (Math.floor(now.getDate() / 7) + 1 !== dayOfWeek.ordinal) {
              continue;
            }
            newTaskArray.push(task);
          } else {
            const dayOfWeek = condition.dayOfWeeks as number[];

            if (dayOfWeek.includes(now.getDay())) {
              newTaskArray.push(task);
            }
          }
        }
      }

      this.subject.next(newTaskArray);
    });
  }

  addTask(task: IPartialTask, isTemporary = false) {
    return addDoc(this.taskCollection, {
      ...task,
      uid: this.userId,
      isDone: false,
      isTemporary,
      timestamp: Date.now(),
    });
  }

  updateTask(id: string, data: ITaskUpdateData) {
    const taskRef = this.getTaskDocRef(id);
    return updateDoc(taskRef, { ...data });
  }

  deleteTask(id: string) {
    const taskRef = this.getTaskDocRef(id);
    return deleteDoc(taskRef);
  }

  async isTemporaryTaskExists(name: string) {
    const tasks = collectionData(
      query(
        this.taskCollection,
        where('uid', '==', this.userId),
        where('name', '==', name),
        where('isTemporary', '==', true),
      ),
      {
        idField: 'id',
      },
    ) as Observable<ITaskWithId[]>;
    const data = await tasks.pipe(first()).toPromise(Promise);

    return data.length > 0;
  }

  private getTaskDocRef(id: string) {
    return doc(this.firestore, `tasks/${id}`);
  }
}
