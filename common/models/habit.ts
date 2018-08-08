import {PersistedModel, PersistedModelSchema} from "./persisted-model";
import {OwnedModel, OwnedModelSchema} from './owned-model';
import {Execution} from './execution';
import SimpleSchema from 'simpl-schema';

export interface Habit extends PersistedModel, OwnedModel {
  name: string;
  weeklyExecutionTarget: number;
  executions: Execution[];
  detail?: string;
}

export const HabitProps = {
  name: {
    type: String,
  },
  weeklyExecutionTarget: {
    type: Number,
  },
  executions: {
    type: Array,
    optional: true,
  },
  detail: {
    type: String,
    optional: true,
  },
};

export const HabitSchema = new SimpleSchema(HabitProps);
HabitSchema.extend(PersistedModelSchema);
HabitSchema.extend(OwnedModelSchema);