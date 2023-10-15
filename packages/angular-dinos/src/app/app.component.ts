import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  standalone: true,
  selector: 'dino-root',
  template: ` <dino-header />
    <router-outlet />`,
  host: {
    class: 'prose container block px-8 py-4 min-w-full',
  },
  styleUrls: ['./app.component.scss'],
  imports: [HeaderComponent, RouterModule],
})
export class AppComponent {}
