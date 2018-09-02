import {prop, Typegoose} from 'typegoose';

export class Task extends Typegoose {

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  done: boolean;

  @prop()
  detail?: string;
}

export const TaskModel = new Task().getModelForClass(Task);
