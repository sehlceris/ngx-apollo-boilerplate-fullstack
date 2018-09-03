import { Component, EventEmitter, Input, Output } from '@angular/core';
// import {ITodoTask} from '@common/models';
import { ITodoTask } from '../../../../../../common/models';

@Component({
  selector: 'anms-task-card',
  templateUrl: 'task-card.template.html',
  styleUrls: ['task-card.style.scss'],
})
export class TaskCardComponent {
  @Input()
  task: ITodoTask;

  @Output()
  done: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  edit: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  handleCheckboxClick() {
    this.done.emit();
  }

  handleEditClick() {
    this.edit.emit();
  }
}
