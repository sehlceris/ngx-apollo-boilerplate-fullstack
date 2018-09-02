import {IPersistedModel} from './persisted-model';
import {IOwnedModel} from './owned-model';
import {Execution} from './execution';

export interface IHabit extends IPersistedModel, IOwnedModel {
  name: string;
  weeklyExecutionTarget: number;
  executions: Execution[];
  detail?: string;
}
