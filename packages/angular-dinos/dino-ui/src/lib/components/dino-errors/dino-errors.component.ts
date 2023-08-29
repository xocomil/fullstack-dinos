/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'fullstack-dinos-dino-errors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card-body p-2">
      <p class="m-0">The data has some errors. Please fix them to save.</p>

      <ul class="m-0">
        <li *ngFor="let error of errors" class="my-1 mx-0 p-0">{{ error }}</li>
      </ul>
    </div>
  `,
  host: {
    class: 'block card w-full bg-error text-error-content',
  },
  styleUrls: ['./dino-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DinoErrorsComponent {
  @Input() errors: string[] = [];
}
