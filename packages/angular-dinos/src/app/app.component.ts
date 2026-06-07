import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
    selector: 'dino-root',
    template: `
    <dino-header />
    <router-outlet />
  `,
    host: {
        class: 'prose container block px-8 py-4 min-w-full',
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, RouterOutlet]
})
export class AppComponent {}
