import { ICondition } from './condition';

export interface IPartialTask {
  name: string;
  temporaryCondition?: ICondition;
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
