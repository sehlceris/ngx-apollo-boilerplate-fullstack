import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: { title: 'anms.menu.settings' },
  },
  {
    path: 'tasks',
    loadChildren: 'app/feature-modules/tasks/tasks.module#TasksModule',
  },
  {
    path: 'examples',
    loadChildren: 'app/feature-modules/examples/examples.module#ExamplesModule',
  },
  {
    path: '**',
    redirectTo: 'about',
  },
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
