import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EditDinoStore } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  selector: 'fullstack-dinos-openai',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-outline flex-none" (click)="turnOnEditMode()">
      Edit
    </button>
    <div
      class="card card-compact glass mt-4 w-full bg-blue-900 text-blue-50 shadow-lg"
    >
      <div class="card-body">
        <h3 class="card-title">Sending to OpenAI:</h3>
        <div class="mockup-code">
          <pre>{{ detailsStore.openAiObject() | json }}</pre>
        </div>
        <div class="card-actions justify-end">
          <button class="btn btn-outline btn-primary" (click)="sendToOpenai()">
            Send to OpenAI
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './openai.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenaiComponent {
  readonly #router = inject(Router);
  protected readonly detailsStore = inject(EditDinoStore);

  protected turnOnEditMode() {
    void this.#router.navigate([], {
      queryParams: { editMode: true },
      queryParamsHandling: 'merge',
    });
  }

  protected sendToOpenai() {
    this.detailsStore.sendToOpenai();
  }
}
