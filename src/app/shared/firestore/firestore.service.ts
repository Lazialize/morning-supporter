import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where,
  docData,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ITask, ITaskWithId } from './types';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private taskCollection: CollectionReference<ITask>;

  constructor(private firestore: Firestore, private auth: AuthService) {
    this.taskCollection = collection(this.firestore, 'tasks') as CollectionReference<ITask>;
  }

  addTask(task: ITask) {
    addDoc(this.taskCollection, task);
  }

  fetchAllTask() {
    return collectionData(
      query(this.taskCollection, orderBy('timestamp', 'asc'), where('uid', '==', this.auth.getUserId())),
      {
        idField: 'id',
      },
    ) as Observable<ITaskWithId[]>;
  }

  fetchTaskById(id: string) {
    const taskRef = this.getTaskDocRef(id);
    return docData(taskRef, { idField: 'id' }) as Observable<ITaskWithId>;
  }

  updateTask(id: string, data: { [key: string]: any }) {
    const taskRef = this.getTaskDocRef(id);
    return updateDoc(taskRef, data);
  }

  deleteTask(id: string) {
    const taskRef = this.getTaskDocRef(id);
    return deleteDoc(taskRef);
  }

  private getTaskDocRef(id: string) {
    return doc(this.firestore, `tasks/${id}`);
  }
}
