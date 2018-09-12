import { Injectable } from '@angular/core';
import { ITodoTask } from '../../../../../common/models';
import { NEVER, Observable } from 'rxjs';
import { BoundLogger, LogService } from '@app/core/services/log.service';

@Injectable()
export class TasksService {
  public tasks$: Observable<ITodoTask[]> = NEVER;
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
