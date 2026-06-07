import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'dino-root',
  template: `
    <dino-header />
    <router-outlet />
    <strong>$safeNavigationMigration</strong>
    <pre>
      No wrapper: {{ undefined }}
      With wrapper: {{ $safeNavigationMigration(undefined) }}
    </pre
    >
  `,
  host: {
    class: 'prose container block px-8 py-4 min-w-full',
  },
  imports: [HeaderComponent, RouterOutlet],
})
export class AppComponent {}
