export interface ITask {
  uid: string;
  name: string;
  timestamp: number;
  isDone: boolean;
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
}

export interface IUserSettingWithId extends IUserSetting {
  id?: string;
}
