import { Injectable } from '@angular/core';
import { doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { IUserSetting, IUserSettingUpdateData, IUserSettingWithId } from './interfaces/user-setting';

@Injectable({
  providedIn: 'root',
})
export class UserSettingService {
  private userId: string;
  private observer$: Observable<IUserSetting>;

  constructor(private firestore: Firestore) {}

  initialize(userId: string) {
    this.userId = userId;
    this.observer$ = docData(this.getSettingRef(), { idField: 'id' }) as Observable<IUserSetting>;
  }

  getObserver(): Observable<IUserSetting> {
    return this.observer$;
  }

  setUserSettings(data: IUserSetting | IUserSettingWithId): Promise<void> {
    if ('id' in Object.keys(data)) {
      delete (data as IUserSettingWithId).id;
    }

    return setDoc(this.getSettingRef(), data);
  }

  updateUserSettings(data: IUserSettingUpdateData) {
    return updateDoc(this.getSettingRef(), { ...data });
  }

  private getSettingRef() {
    return doc(this.firestore, `users/${this.userId}`);
  }
}
