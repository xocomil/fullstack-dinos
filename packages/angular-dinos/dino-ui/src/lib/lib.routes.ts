import { Route } from '@angular/router';

export const angularDinosDinoUiRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((c) => c.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: ':dinoId',
    loadComponent: () =>
      import('./components/details/details.component').then(
        (c) => c.DetailsComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
