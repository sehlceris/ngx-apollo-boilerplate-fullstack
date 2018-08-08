import SimpleSchema from 'simpl-schema';

export interface PersistedModel {
  _id?: string;
  _created: Date;
}

export const PersistedModelProps = {
  _id: {
    type: String,
    optional: true,
  },
  _created: {
    type: Date,
    optional: true,
  },
};

export const PersistedModelSchema = new SimpleSchema(PersistedModelProps);