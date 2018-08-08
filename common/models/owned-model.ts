import SimpleSchema from 'simpl-schema';

export interface OwnedModel {
  ownerId: string;
}

export const OwnedModelProps = {
  ownerId: {
    type: String,
    optional: true,
  },
};

export const OwnedModelSchema = new SimpleSchema(OwnedModelProps);