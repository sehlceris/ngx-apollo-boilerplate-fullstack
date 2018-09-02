export interface IPersistedModel {
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
