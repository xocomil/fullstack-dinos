import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EditDinoStore } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { extraDescriptionFromDino } from '../models/details.constants';

@Component({
  selector: 'fullstack-dinos-display-dino',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-1 gap-2">
      <h1 class="mb-1 flex-grow text-blue-500">
        {{ detailsStore.dinosaur().dinoName }}
      </h1>
      <button
        class="btn btn-outline btn-secondary flex-none"
        (click)="turnOnOpenAiMode()"
      >
        OpenAI
      </button>
      <button class="btn btn-outline flex-none" (click)="turnOnEditMode()">
        Edit
      </button>
    </div>
    <div class="columns-2">
      <div class="text-2xl italic text-blue-500/70">
        {{ detailsStore.genusSpecies() }}
      </div>
      <div class="text-right italic text-blue-500/70">
        <strong>Last updated:</strong>
        {{ detailsStore.dinosaur().updatedAt | date: 'medium' }}
      </div>
    </div>
    <div
      class="card card-compact glass mt-4 w-full bg-blue-900 text-blue-50 shadow-lg"
    >
      <div class="card-body">
        <h4 class="card-title">Description</h4>
        <p>
          @if (detailsStore.dinosaur().description; as description) {
            {{ description }}
          }
          {{ extraDescription }}
        </p>
      </div>
    </div>
    @if (detailsStore.displayTrivia()) {
      <div
        class="card card-compact glass bg-primary text-primary-content mt-4 w-full shadow-lg"
      >
        <div class="card-body">
          <h2 class="card-title">Trivia</h2>
          <ul>
            @for (item of detailsStore.dinosaur().trivia; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </div>
      </div>
    }
  `,
  styleUrls: ['./display-dino.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class DisplayDinoComponent {
  readonly #router = inject(Router);
  protected readonly detailsStore = inject(EditDinoStore);

  protected get extraDescription(): string {
    return extraDescriptionFromDino(this.detailsStore.dinosaur());
  }

  protected turnOnEditMode(): void {
    void this.#router.navigate([], { queryParams: { editMode: true } });
  }

  turnOnOpenAiMode() {
    void this.#router.navigate([], { queryParams: { openAiMode: true } });
  }
}
