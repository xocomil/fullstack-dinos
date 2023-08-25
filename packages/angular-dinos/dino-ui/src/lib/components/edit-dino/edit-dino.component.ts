/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { TextInputComponent } from '@ui-components';

@Component({
  selector: 'fullstack-dinos-edit-dino',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TextInputComponent],
  host: { class: 'block' },
  template: `
    <pre>{{ detailsStore.errors() | json }}</pre>
    <form #dinoForm="ngForm" (ngSubmit)="onSubmit(dinoForm)">
      <div class="grid grid-cols-3 gap-4 mb-4">
        <!-- <ui-text-input
          label="Name"
          id="name"
          error="detailsStore.errors().name"
          [ngModel]="detailsStore.dinosaur().name"
          placeholder="Dinosaur's name"
        /> -->

        <ui-text-input inputId="name" />

        <div class="form-control">
          <label for="name">Name</label>
          <input
            id="name"
            name="name"
            [class.error]="detailsStore.errors().name"
            [ngModel]="detailsStore.dinosaur().name"
            placeholder="Dinosaur's name"
          />
          <span class="error" *ngIf="detailsStore.errors().name">
            {{ detailsStore.errors().name }}
          </span>
        </div>
        <div class="form-control">
          <label for="genus">Genus</label>
          <input
            id="genus"
            name="genus"
            [class.error]="detailsStore.errors().genus"
            [ngModel]="detailsStore.dinosaur().genus"
            placeholder="Dinosaur's genus"
          />
        </div>
        <div class="form-control">
          <label for="species">Species</label>
          <input
            id="species"
            name="species"
            [class.error]="detailsStore.errors().species"
            [ngModel]="detailsStore.dinosaur().species"
            placeholder="Dinosaur's species"
          />
        </div>
        <div class="form-control">
          <label for="heightInMeters">Height (m)</label>
          <input
            id="heightInMeters"
            name="heightInMeters"
            type="number"
            [class.error]="detailsStore.errors().heightInMeters"
            [ngModel]="detailsStore.dinosaur().heightInMeters"
            placeholder="Dinosaur's heightInMeters"
          />
        </div>
        <div class="form-control">
          <label for="weightInKilos">Weight (kg)</label>
          <input
            id="weightInKilos"
            name="weightInKilos"
            type="number"
            [class.error]="detailsStore.errors().weightInKilos"
            [ngModel]="detailsStore.dinosaur().weightInKilos"
            placeholder="Dinosaur's weightInKilos"
          />
        </div>
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
