import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';

@Component({
  selector: 'fullstack-dinos-details',
  standalone: true,
  template: `
    <fullstack-dinos-edit-dino
      *ngIf="detailsStore.editMode(); else displayMode"
    />
    <ng-template #displayMode>
      <h1 class="mb-1 text-blue-500">{{ detailsStore.dinosaur().name }}</h1>
      <div class="text-2xl italic text-blue-500 opacity-70">
        {{ detailsStore.genusSpecies() }}
      </div>
      <div class="card card-compact glass mt-4 bg-blue-900 text-blue-50 w-full">
        <div class="card-body">
          <h4 class="card-title">Description</h4>
          <p>
            <span *ngIf="detailsStore.dinosaur().description; let description">
              {{ description }}
            </span>
            {{ detailsStore.dinosaur().name }} was around
            {{ detailsStore.dinosaur().heightInMeters }} meters tall and weighed
            around
            {{ detailsStore.dinosaur().weightInKilos | number }} kilograms.
            {{ detailsStore.dinosaur().name }} did
            {{ detailsStore.dinosaur().hasFeathers ? '' : 'not' }} have
            feathers.
          </p>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./details.component.scss'],
  providers: [DetailsStoreService],
  imports: [CommonModule, FormsModule, EditDinoComponent],
})
export class DetailsComponent {
  protected readonly detailsStore = inject(DetailsStoreService);

  @Input() set dinoId(id: string | undefined) {
    this.detailsStore.setId(id);
  }

  @Input() set editMode(editMode: boolean | undefined) {
    this.detailsStore.setEditMode(editMode);
  }
}
