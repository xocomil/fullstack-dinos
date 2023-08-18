import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouteToHomeComponent } from '@dino-ui/components';

@Component({
  selector: 'dino-header',
  standalone: true,
  template: `<h1 class="text-center">Welcome to DinosAPI</h1>
    <div class="flex justify-end">
      <fullstack-dinos-route-to-home />
    </div>`,
  styleUrls: ['./header.component.scss'],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'block' },
  imports: [CommonModule, RouteToHomeComponent],
})
export class HeaderComponent {}
