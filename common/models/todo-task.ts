import {IPersistedModel} from './persisted-model';
import {IOwnedModel} from './owned-model';

export interface ITodoTask extends IPersistedModel {
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
