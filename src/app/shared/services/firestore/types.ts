export interface ITask {
  uid: string;
  name: string;
  timestamp: number;
  isDone: boolean;
  isTemporary: boolean;
}

export interface ITaskWithId extends ITask {
  id: string;
}

export interface IUserSetting {
  location: {
    name: string;
    lat: string;
    lon: string;
  };
  attendanceTime: number;
  notificationTime: number;
}

export interface IUserSettingWithId extends IUserSetting {
  id?: string;
}
