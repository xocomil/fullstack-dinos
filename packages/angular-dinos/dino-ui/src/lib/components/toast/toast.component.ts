
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'fullstack-dinos-toast',
    imports: [],
    template: `
    <div class="alert alert-error">
      <ng-content />
    </div>
  `,
    styleUrls: ['./toast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'block toast toast-center',
    }
})
export class ToastComponent {}
