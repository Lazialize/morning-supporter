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
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ITask, ITaskWithId, IUserSetting, IUserSettingWithId } from './types';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private taskCollection: CollectionReference<ITask>;

  constructor(private firestore: Firestore, private auth: AuthService) {
    this.taskCollection = collection(this.firestore, 'tasks') as CollectionReference<ITask>;
  }

  addTask(task: ITask) {
    return addDoc(this.taskCollection, task);
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

  fetchTempTaskByName(id: string, name: string) {
    return collectionData(
      query(this.taskCollection, where('uid', '==', id), where('name', '==', name), where('isTemporary', '==', true)),
      {
        idField: 'id',
      },
    ) as Observable<ITaskWithId[]>;
  }

  updateTask(id: string, data: { [key: string]: any }) {
    const taskRef = this.getTaskDocRef(id);
    return updateDoc(taskRef, data);
  }

  deleteTask(id: string) {
    const taskRef = this.getTaskDocRef(id);
    return deleteDoc(taskRef);
  }

  getUserSettingsById(id: string) {
    const userRef = doc(this.firestore, `users/${id}`);
    return docData(userRef, { idField: 'id' }) as Observable<IUserSettingWithId>;
  }

  setUserSettings(id: string, data: IUserSetting | IUserSettingWithId) {
    if ('id' in Object.keys(data)) {
      delete (data as IUserSettingWithId).id;
    }

    const userRef = doc(this.firestore, `users/${id}`);
    return setDoc(userRef, data);
  }

  updateUserSettings(id: string, data: { [key: string]: any }) {
    const userRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userRef, data);
  }

  private getTaskDocRef(id: string) {
    return doc(this.firestore, `tasks/${id}`);
  }
}
