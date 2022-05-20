export interface IUserSetting {
  location: {
    name: string;
    lat: string;
    lon: string;
  };
  attendanceTime: number;
  notificationTime: number;
  temporaryTasks: {
    name: string;
    tense: number[];
    conditions: number[];
  }[];
}

export interface IUserSettingWithId extends IUserSetting {
  id?: string;
}

export interface IUserSettingUpdateData {
  location?: {
    name: string;
    lat: string;
    lon: string;
  };
  attendanceTime?: number;
  notificationTime?: number;
  temporaryTasks?: {
    name: string;
    tense: number[];
    conditions: number[];
  }[];
}
