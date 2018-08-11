import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable, Subscription} from 'rxjs';
import {TodoTask} from '../../../../../common/models';
import {TasksService} from './tasks.service';
import {map} from 'rxjs/operators';
import {createAnimatedListItemTriggers} from '@app/core/animations/animated-list-items';
import {AppConfig} from '@app/app.config';

@Component({
  selector: 'anms-tasks',
  templateUrl: 'tasks.template.html',
  styleUrls: ['tasks.style.scss'],
  animations: [
    ...createAnimatedListItemTriggers('1em'),
  ],
})
export class TasksComponent implements OnInit, OnDestroy {

  public notDoneTasks$: Observable<TodoTask[]>;
  deletedSiblingIndex = Infinity;

  subscriptions: Subscription[] = [];

  constructor(
    public tasksService: TasksService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.notDoneTasks$ = this.tasksService.tasks$
      .pipe(
        map((tasks: TodoTask[]) => {
          return tasks.filter((task: TodoTask) => !task.done);
        }),
      );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  addTask(name: string) {
    this.tasksService.addTask(name).subscribe();
  }

  markTaskAsDone(task: TodoTask, index: number) {
    this.deletedSiblingIndex = index;
    this.tasksService.markTaskAsDone(task._id).subscribe(
      () => {
        this.snackBar
          .open('Task Done!', 'UNDO', {
            duration: AppConfig.SnackDuration,
          })
          .onAction()
          .subscribe(() => {
            this.tasksService.markTaskAsNotDone(task._id).subscribe();
          });
      },
    );
  }

  editTask(task: TodoTask) {

  }

  handleTaskRemovalComplete(event) {
    this.deletedSiblingIndex = Infinity;
  }
}
