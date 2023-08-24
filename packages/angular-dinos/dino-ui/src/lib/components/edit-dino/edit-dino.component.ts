/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  selector: 'fullstack-dinos-edit-dino',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  host: { class: 'block' },
  template: `
    <pre>{{ detailsStore.errors() | json }}</pre>
    <form
      #dinoForm="ngForm"
      class="columns-3 gap-4"
      (ngSubmit)="onSubmit(dinoForm)"
    >
      <div class="form-control">
        <label>Name</label>
        <input
          name="name"
          [class.error]="detailsStore.errors().name"
          [ngModel]="detailsStore.dinosaur().name"
          placeholder="Dinosaur's name"
        />
      </div>
      <div class="form-control">
        <label>Species</label>
        <input
          name="species"
          [class.error]="detailsStore.errors().species"
          [ngModel]="detailsStore.dinosaur().species"
          placeholder="Dinosaur's species"
        />
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
      <button
        type="button"
        class="btn btn-outline btn-secondary"
        [routerLink]="['/dinos', detailsStore.id()]"
        (click)="cancel()"
      >
        Cancel
      </button>
    </form>
  `,
  styleUrls: ['./edit-dino.component.scss'],
})
export class EditDinoComponent {
  protected readonly detailsStore = inject(DetailsStoreService);

  protected onSubmit(dinoForm: NgForm): void {
    this.detailsStore.updateDino(dinoForm.value);
  }

  protected cancel(): void {
    this.detailsStore.clearErrors();
  }
}
