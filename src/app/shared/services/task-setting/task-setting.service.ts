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
import { AuthService } from '../auth/auth.service';
import { ITaskConfig, IPartialTaskConfig, ITaskConfigWithId } from './interfaces/task-setting';

@Injectable({
  providedIn: 'root',
})
export class TaskSettingService {
  private observer$: Observable<ITaskConfigWithId[]>;

  private collection: CollectionReference<ITaskConfig>;

  private userId: string;

  constructor(private firestore: Firestore, private auth: AuthService) {
    this.collection = collection(this.firestore, 'taskConfigs') as CollectionReference<ITaskConfig>;
    this.observer$ = null;
  }

  initialize() {
    this.userId = this.auth.getUserId();
    this.observer$ = collectionData(
      query(this.collection, orderBy('timestamp', 'asc'), where('uid', '==', this.userId)),
      { idField: 'id' },
    ) as Observable<ITaskConfigWithId[]>;
  }

  getObserver(): Observable<ITaskConfigWithId[]> {
    return this.observer$;
  }

  addTask(createData: IPartialTaskConfig) {
    return addDoc(this.collection, {
      ...createData,
      uid: this.userId,
      isConditional: Boolean(createData.condition),
      timestamp: Date.now(),
    });
  }

  updateTask(id: string, updateData: IPartialTaskConfig) {
    const ref = this.getTaskCOnfigDocRef(id);
    return updateDoc(ref, {
      ...updateData,
    });
  }

  deleteTask(id: string) {
    const ref = this.getTaskCOnfigDocRef(id);
    return deleteDoc(ref);
  }

  private getTaskCOnfigDocRef(id: string) {
    return doc(this.firestore, `taskConfigs/${id}`);
  }
}
