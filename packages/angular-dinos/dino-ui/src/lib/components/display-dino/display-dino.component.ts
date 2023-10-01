import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { extraDescriptionFromDino } from '../models/details.constants';

@Component({
  selector: 'fullstack-dinos-display-dino',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="flex flex-1 gap-2">
      <h1 class="mb-1 text-blue-500 flex-grow">
        {{ detailsStore.dinosaur().name }}
      </h1>
      <button class="btn btn-outline flex-none" (click)="turnOnEditMode()">
        Edit
      </button>
    </div>
    <div class="columns-2">
      <div class="text-2xl italic text-blue-500/70">
        {{ detailsStore.genusSpecies() }}
      </div>
      <div class="text-right text-blue-500/70 italic">
        <strong>Last updated:</strong>
        {{ detailsStore.dinosaur().updatedAt | date: 'medium' }}
      </div>
    </div>
    <div
      class="card card-compact glass mt-4 bg-blue-900 text-blue-50 w-full shadow-lg"
    >
      <div class="card-body">
        <h4 class="card-title">Description</h4>
        <p>
          <span *ngIf="detailsStore.dinosaur().description; let description">
            {{ description }}
          </span>
          {{ extraDescription }}
        </p>
      </div>
    </div>
    <div
      *ngIf="detailsStore.displayTrivia()"
      class="card card-compact glass mt-4 w-full bg-primary text-primary-content shadow-lg"
    >
      <div class="card-body">
        <h2 class="card-title">Trivia</h2>
        <ul>
          @for (item of detailsStore.dinosaur().trivia; track item) {
          <li>{{ item }}</li>
          }
        </ul>
      </div>
    </div>`,
  styleUrls: ['./display-dino.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class DisplayDinoComponent {
  readonly #router = inject(Router);
  protected readonly detailsStore = inject(DetailsStoreService);

  protected get extraDescription(): string {
    return extraDescriptionFromDino(this.detailsStore.dinosaur());
  }

  protected turnOnEditMode(): void {
    void this.#router.navigate([], { queryParams: { editMode: true } });
  }
}
