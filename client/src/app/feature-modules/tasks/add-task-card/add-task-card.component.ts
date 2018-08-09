import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {FormValidationService} from '@app/core/services/form-validation.service';
import {LogService} from '@app/core/services/log-service';

@Component({
  selector: 'anms-add-task-card',
  templateUrl: 'add-task-card.htmplate.html',
  styleUrls: [
    'add-task-card.style.scss',
  ],
})
export class AddTaskCardComponent implements OnInit {

  @Output() addTaskName: EventEmitter<string> = new EventEmitter<string>();

  addTaskForm: FormGroup;

  constructor(
    public formValidationService: FormValidationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private logService: LogService,
  ) {

  }

  ngOnInit() {
    this.addTaskForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
    });
  }

  handleSubmit() {
    if (this.addTaskForm.valid) {
      this.addTaskName.emit(this.addTaskForm.value.name);
      this.addTaskForm.reset();
    }
  }
}
