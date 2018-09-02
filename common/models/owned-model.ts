export interface IOwnedModel {
  ownerId: string;
}

export const OwnedModelProps = {
  ownerId: {
    type: String,
    optional: true,
  },
};
