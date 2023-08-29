/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { TextInputComponent } from '@ui-components';
import { DinoErrorsComponent } from '../dino-errors/dino-errors.component';

@Component({
  selector: 'fullstack-dinos-edit-dino',
  standalone: true,
  host: { class: 'block' },
  template: `
    <fullstack-dinos-dino-errors
      *ngIf="detailsStore.errorsArray().length > 0"
      [errors]="detailsStore.errorsArray()"
    />
    <form #dinoForm="ngForm" (ngSubmit)="onSubmit(dinoForm)">
      <div class="grid grid-cols-3 gap-4 mb-4">
        <ui-text-input
          id="name"
          name="name"
          placeholder="Dinosaur's name"
          labelText="Name"
          [ngModel]="detailsStore.dinosaur().name"
          [errorText]="detailsStore.errors().name"
        />
        <ui-text-input
          id="genus"
          name="genus"
          placeholder="Dinosaur's genus"
          labelText="Genus"
          [ngModel]="detailsStore.dinosaur().genus"
          [errorText]="detailsStore.errors().genus"
        />
        <ui-text-input
          id="species"
          name="species"
          labelText="Species"
          [errorText]="detailsStore.errors().species"
          [ngModel]="detailsStore.dinosaur().species"
          placeholder="Dinosaur's species"
        />
        <ui-text-input
          id="heightInMeters"
          name="heightInMeters"
          labelText="Height (m)"
          type="number"
          [errorText]="detailsStore.errors().heightInMeters"
          [ngModel]="detailsStore.dinosaur().heightInMeters"
          placeholder="Dinosaur's heightInMeters"
        />
        <ui-text-input
          id="weightInKilos"
          name="weightInKilos"
          labelText="Weight (kg)"
          type="number"
          [errorText]="detailsStore.errors().weightInKilos"
          [ngModel]="detailsStore.dinosaur().weightInKilos"
          placeholder="Dinosaur's weightInKilos"
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
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TextInputComponent,
    DinoErrorsComponent,
  ],
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
