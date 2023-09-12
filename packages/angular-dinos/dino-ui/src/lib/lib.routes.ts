import { Route } from '@angular/router';

export const angularDinosDinoUiRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((c) => c.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/add-dino/add-dino.component').then(
        (c) => c.AddDinoComponent,
      ),
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
