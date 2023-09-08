import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import {
  TextInputComponent,
  TextareaComponent,
  ToggleComponent,
} from '@ui-components';
import { DinoErrorsComponent } from '../dino-errors/dino-errors.component';

@Component({
  selector: 'fullstack-dinos-edit-dino',
  standalone: true,
  host: { class: 'block' },
  template: `
    <fullstack-dinos-dino-errors
      class="hidden lg:block"
      *ngIf="detailsStore.errorsArray().length > 0"
      [errors]="detailsStore.errorsArray()"
    />
    <form #dinoForm="ngForm" (ngSubmit)="onSubmit(dinoForm)">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
        <ui-textarea
          id="description"
          name="description"
          class="md:col-span-2"
          labelText="Description"
          altLabelText="Make it jazzy!"
          [ngModel]="detailsStore.dinosaur().description"
          [errorText]="detailsStore.errors().description"
        />
        <ui-toggle
          id="hasFeathers"
          name="hasFeathers"
          labelText="Has Feathers?"
          [ngModel]="detailsStore.dinosaur().hasFeathers"
        />
        <ui-text-input
          id="heightInMeters"
          name="heightInMeters"
          labelText="Height (m)"
          type="number"
          [errorText]="detailsStore.errors().heightInMeters"
          [ngModel]="detailsStore.dinosaur().heightInMeters"
          placeholder="Dinosaur's height in meters"
        />
        <ui-text-input
          id="weightInKilos"
          name="weightInKilos"
          labelText="Weight (kg)"
          type="number"
          [errorText]="detailsStore.errors().weightInKilos"
          [ngModel]="detailsStore.dinosaur().weightInKilos"
          placeholder="Dinosaur's weight in kilograms"
        />
        <ui-text-input
          id="imageUrl"
          name="imageUrl"
          labelText="URL to Image"
          [errorText]="detailsStore.errors().imageUrl"
          [ngModel]="detailsStore.dinosaur().imageUrl"
          placeholder="URL to Image"
        />
      </div>
      <input
        type="hidden"
        name="trivia"
        [ngModel]="detailsStore.dinosaur().trivia"
      />
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
    DinoErrorsComponent,
    FormsModule,
    RouterLink,
    TextareaComponent,
    TextInputComponent,
    ToggleComponent,
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
