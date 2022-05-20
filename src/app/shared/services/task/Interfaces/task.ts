export interface IPartialTask {
  name: string;
}

export interface ITask extends IPartialTask {
  uid: string;
  timestamp: number;
  isDone: boolean;
  isTemporary: boolean;
}

export interface ITaskWithId extends ITask {
  id: string;
}

export interface ITaskUpdateData {
  name?: string;
  isDone?: boolean;
}
