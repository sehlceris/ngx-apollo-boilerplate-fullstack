import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
    data: {
      title: 'About',
    },
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'anms.menu.settings',
    },
  },
  {
    path: 'tasks',
    loadChildren: 'app/feature-modules/tasks/tasks.module#TasksModule',
    data: {
      title: 'Tasks',
    },
  },
  {
    path: 'examples',
    loadChildren: 'app/feature-modules/examples/examples.module#ExamplesModule',
    data: {
      title: 'Examples',
    },
  },
  {
    path: '**',
    redirectTo: 'about',
  },
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(APP_ROUTES, {
      useHash: false,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
