import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
// import {AuthGuard} from '../../shared-services/auth-guard.service';
import { TasksComponent } from './tasks.component';

export const TASKS_ROUTE_NAMES = {
  Root: '',
};
Object.freeze(TASKS_ROUTE_NAMES);

const TASKS_ROUTES: Routes = [
  {
    path: TASKS_ROUTE_NAMES.Root,
    component: TasksComponent,
    canActivate: [
      // AuthGuard,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(TASKS_ROUTES)],
  exports: [RouterModule],
  declarations: [],
})
export class TasksRoutingModule {}
