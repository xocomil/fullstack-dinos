import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'fullstack-dinos-route-to-home',
  standalone: true,
  imports: [RouterLink],
  template: `<a [routerLink]="['/']">Dinos</a>`,
})
export class RouteToHomeComponent {}
