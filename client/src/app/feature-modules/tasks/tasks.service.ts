import {Injectable} from '@angular/core';
import {ITodoTask} from '../../../../../common/models';
import {NEVER, Observable, of} from 'rxjs';
import {BoundLogger, LogService} from '@app/core/services/log.service';

@Injectable()
export class TasksService {
  public tasks$: Observable<ITodoTask[]> = of([
    {
      name: 'Test Task 1',
      done: false,
      detail: 'detail doesnt even show up anywhere yet',
      _created: null,
    },
    {
      name: 'Test Task 2',
      done: true,
      detail: 'detail doesnt even show up anywhere yet',
      _created: null,
    },
    {
      name: 'Test Task 3',
      done: false,
      detail: 'detail doesnt even show up anywhere yet',
      _created: null,
    },
  ]);
  private log: BoundLogger = this.logService.bindToNamespace('TasksService');

  constructor(private logService: LogService) {}

  public addTask(name: string) {
    return NEVER;
  }

  public removeTask(_id: string) {
    return NEVER;
  }

  public markTaskAsDone(_id: string) {
    return NEVER;
  }

  public markTaskAsNotDone(_id: string) {
    return NEVER;
  }

  public updateTask(task: ITodoTask) {
    return NEVER;
  }
}
