import { Injectable } from '@angular/core';
import { doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { IUserSetting, IUserSettingUpdateData, IUserSettingWithId } from './interfaces/user-setting';

@Injectable({
  providedIn: 'root',
})
export class UserSettingService {
  private userId: string;
  private observer$: Observable<IUserSetting>;

  constructor(private firestore: Firestore, private auth: AuthService) {}

  initialize() {
    this.userId = this.auth.getUserId();
    this.observer$ = docData(this.getSettingRef(), { idField: 'id' }) as Observable<IUserSetting>;
  }

  getObserver(): Observable<IUserSetting> {
    if (this.observer$ === null || this.userId !== this.auth.getUserId()) {
      this.initialize();
    }
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
    return doc(this.firestore, `users/${this.auth.getUserId()}`);
  }
}
