import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  selector: 'fullstack-dinos-display-dino',
  standalone: true,
  imports: [CommonModule],
  template: `<h1 class="mb-1 text-blue-500">
      {{ detailsStore.dinosaur().name }}
    </h1>
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
          {{ detailsStore.dinosaur().name }} was around
          {{ detailsStore.dinosaur().heightInMeters }} meters tall and weighed
          around {{ detailsStore.dinosaur().weightInKilos | number }} kilograms.
          {{ detailsStore.dinosaur().name }} did
          {{ detailsStore.dinosaur().hasFeathers ? '' : 'not' }} have feathers.
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
          <li *ngFor="let item of detailsStore.dinosaur().trivia">
            {{ item }}
          </li>
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
  protected readonly detailsStore = inject(DetailsStoreService);
}
