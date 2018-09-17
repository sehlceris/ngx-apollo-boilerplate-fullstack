import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable, Subscription} from 'rxjs';
import {ITodoTask} from '../../../../../common/models';
import {TasksService} from './tasks.service';
import {map} from 'rxjs/operators';
import {createAnimatedListItemTriggers} from '@app/core/animations/animated-list-items';
import {AppConfig} from '@app/app.config';

/*
  We cannot use function expressions in decorators in prod,
  So we generate them in dev, print them to the console, and then paste them here

  const animations = createAnimatedListItemTriggers('1em');
  console.dir(animations);
  copy(animations);
 */
const animations = [
  {
    'type': 7,
    'name': 'animatedListItemIn',
    'definitions': [
      {
        'type': 1,
        'expr': 'void => *',
        'animation': [
          {
            'type': 6,
            'styles': {
              'opacity': 0,
              'transform': 'translateX(-5%) scale(0.92)',
            },
            'offset': null,
          },
          {
            'type': 4,
            'styles': {
              'type': 6,
              'styles': {
                'opacity': 1,
                'transform': 'translateX(0) scale(1.0)',
              },
              'offset': null,
            },
            'timings': 300,
          },
        ],
        'options': null,
      },
    ],
    'options': {},
  },
  {
    'type': 7,
    'name': 'animatedListItemOut',
    'definitions': [
      {
        'type': 1,
        'expr': '* => void',
        'animation': [
          {
            'type': 6,
            'styles': {
              'zIndex': -1,
              'transform': 'translateX(0) scale(1.0)',
              'boxShadow': 'none',
            },
            'offset': null,
          },
          {
            'type': 4,
            'styles': {
              'type': 6,
              'styles': {
                'opacity': 0,
                'transform': 'translateX(50%) scale(0.5)',
              },
              'offset': null,
            },
            'timings': 300,
          },
        ],
        'options': null,
      },
    ],
    'options': {},
  },
  {
    'type': 7,
    'name': 'animatedListItemBelowRemovedSibling',
    'definitions': [
      {
        'type': 1,
        'expr': 'false => true',
        'animation': [
          {
            'type': 6,
            'styles': {
              'transform': 'translateY(0px)',
            },
            'offset': null,
          },
          {
            'type': 4,
            'styles': {
              'type': 6,
              'styles': {
                'transform': 'translateY(calc(-100% - 1em)',
              },
              'offset': null,
            },
            'timings': 300,
          },
        ],
        'options': null,
      },
      {
        'type': 1,
        'expr': 'true => false',
        'animation': [
          {
            'type': 6,
            'styles': {
              'transform': 'translateY(0px)',
            },
            'offset': null,
          },
        ],
        'options': null,
      },
    ],
    'options': {},
  },
];

@Component({
  selector: 'anms-tasks',
  templateUrl: 'tasks.template.html',
  styleUrls: ['tasks.style.scss'],
  animations,
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
