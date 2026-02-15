/* eslint-disable @angular-eslint/no-host-metadata-property */

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'fullstack-dinos-dino-errors',
    imports: [FormsModule],
    template: `
    <div class="card-body p-2">
      <p class="m-0">The data has some errors. Please fix them to save.</p>

      <ul class="m-0">
        @for (error of errors(); track error) {
          <li class="mx-0 my-1 p-0">{{ error }}</li>
        }
      </ul>
    </div>
  `,
    host: {
        class: 'block card w-full bg-error text-error-content',
    },
    styleUrls: ['./dino-errors.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DinoErrorsComponent {
  errors = input<string[]>([]);
}
