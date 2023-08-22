import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  selector: 'fullstack-dinos-edit-dino',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <form class="columns-3 gap-4">
      <div class="form-control">
        <label class="label text-secondary">Name</label>
        <input
          name="name"
          class="input input-bordered"
          [ngModel]="detailsStore.dinosaur().name"
        />
      </div>
      <div class="form-control">
        <label class="label text-secondary">Species</label>
        <input
          name="species"
          class="input input-bordered"
          [ngModel]="detailsStore.dinosaur().species"
        />
      </div>
      <button
        type="button"
        class="btn btn-outline btn-secondary"
        [routerLink]="['/dinos', detailsStore.id()]"
      >
        Cancel
      </button>
    </form>
  `,
  styleUrls: ['./edit-dino.component.scss'],
})
export class EditDinoComponent {
  protected readonly detailsStore = inject(DetailsStoreService);
}
