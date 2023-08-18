import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'dinos',
    loadChildren: () =>
      import('@dino-ui').then((m) => m.angularDinosDinoUiRoutes),
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
