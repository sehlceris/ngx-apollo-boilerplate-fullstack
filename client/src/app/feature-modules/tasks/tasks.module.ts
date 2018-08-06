import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared';
import {AddTaskCardComponent} from './add-task-card/add-task-card.component';
import {TaskCardComponent} from './task-card/task-card.component';
import {TasksRoutingModule} from './tasks-routes.module';
import {TasksComponent} from './tasks.component';
import {TasksService} from './tasks.service';

@NgModule({
  imports: [
    SharedModule,
    TasksRoutingModule,
  ],
  exports: [],
  declarations: [
    TasksComponent,
    TaskCardComponent,
    AddTaskCardComponent,
  ],
  providers: [
    TasksService,
  ],
})
export class TasksModule {
}
