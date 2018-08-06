import {Component, EventEmitter, Input, Output} from '@angular/core';
// import {TodoTask} from '@common/models';
import {TodoTask} from '../../../../../../common/models';

@Component({
  selector: 'task-card',
  templateUrl: 'task-card.template.html',
  styleUrls: [
    'task-card.style.scss',
  ],
})
export class TaskCardComponent {

  @Input() task: TodoTask;

  @Output() done: EventEmitter<void> = new EventEmitter<void>();
  @Output() edit: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  handleCheckboxClick() {
    this.done.emit();
  }

  handleEditClick() {
    this.edit.emit();
  }
}