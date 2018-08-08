import {PersistedModel, PersistedModelSchema} from "./persisted-model";
import {OwnedModel, OwnedModelSchema} from './owned-model';
import SimpleSchema from 'simpl-schema';

export interface TodoTask extends PersistedModel, OwnedModel {
  name: string;
  done: boolean;
  detail?: string;
}

export const TodoTaskProps = {
  name: {
    type: String,
  },
  done: {
    type: Boolean,
  },
  detail: {
    type: String,
    optional: true,
  },
};

export const TodoTaskSchema = new SimpleSchema(TodoTaskProps);
TodoTaskSchema.extend(PersistedModelSchema);
TodoTaskSchema.extend(OwnedModelSchema);