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
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IPartialTask, ITask, ITaskUpdateData, ITaskWithId } from './Interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private observer$: Observable<ITaskWithId[]>;
  private taskCollection: CollectionReference<ITask>;

  private userId: string;

  constructor(private firestore: Firestore) {
    this.taskCollection = collection(this.firestore, 'tasks') as CollectionReference<ITask>;
    this.observer$ = null;
  }

  initialize(userId: string): void {
    this.userId = userId;
    this.observer$ = collectionData(
      query(this.taskCollection, orderBy('timestamp', 'asc'), where('uid', '==', userId)),
      { idField: 'id' },
    ) as Observable<ITaskWithId[]>;
  }

  getObserver(): Observable<ITaskWithId[]> {
    return this.observer$;
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
