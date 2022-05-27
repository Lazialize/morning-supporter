import { ICondition } from './condition';

export interface IPartialTaskConfig {
  name: string;
  condition?: ICondition;
}

export interface ITaskConfig extends IPartialTaskConfig {
  uid: string;
  timestamp: number;
  isConditional: boolean;
}

export interface ITaskConfigWithId extends ITaskConfig {
  id: string;
}
