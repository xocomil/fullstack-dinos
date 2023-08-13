import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const angularDinosDinoUiRoutes: Route[] = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
];
