import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'fullstack-dinos-route-to-home',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
    <a [routerLink]="['/']">Dinos</a>
  `
})
export class RouteToHomeComponent {}
