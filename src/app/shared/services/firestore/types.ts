export interface ITask {
  uid: string;
  name: string;
  timestamp: number;
  isDone: boolean;
}

export interface ITaskWithId extends ITask {
  id: string;
}
