import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import { AnimatedListItems } from "@app/core/animations/animated-list-items";
import {Observable, Subscription} from 'rxjs';
import {ITodoTask} from '../../../../../common/models';
import {TasksService} from './tasks.service';
import {map} from 'rxjs/operators';
import {AppConfig} from '@app/app.config';

@Component({
  selector: 'anms-tasks',
  templateUrl: 'tasks.template.html',
  styleUrls: ['tasks.style.scss'],
  animations: AnimatedListItems.buildTriggers('1em'),
})
export class TasksComponent implements OnInit, OnDestroy {
  public notDoneTasks$: Observable<ITodoTask[]>;
  deletedSiblingIndex = Infinity;

  subscriptions: Subscription[] = [];

  constructor(
    public tasksService: TasksService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.notDoneTasks$ = this.tasksService.tasks$.pipe(
      map((tasks: ITodoTask[]) => {
        return tasks.filter((task: ITodoTask) => !task.done);
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  addTask(name: string) {
    this.tasksService.addTask(name).subscribe();
  }

  markTaskAsDone(task: ITodoTask, index: number) {
    this.deletedSiblingIndex = index;
    this.tasksService.markTaskAsDone(task._id).subscribe(() => {
      this.snackBar
        .open('Task Done!', 'UNDO', {
          duration: AppConfig.SnackDuration,
        })
        .onAction()
        .subscribe(() => {
          this.tasksService.markTaskAsNotDone(task._id).subscribe();
        });
    });
  }

  editTask(task: ITodoTask) {
  }

  handleTaskRemovalComplete(event) {
    this.deletedSiblingIndex = Infinity;
  }
}
