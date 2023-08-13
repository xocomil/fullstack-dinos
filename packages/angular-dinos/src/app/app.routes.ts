import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'dinos',
    loadChildren: () =>
      import('@fullstack-dinos/angular-dinos/dino-ui').then(
        (m) => m.angularDinosDinoUiRoutes,
      ),
  },
  {
    path: '',
    redirectTo: '/dinos',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dinos',
  },
];
