import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EditDinoStore } from '@fullstack-dinos/angular-dinos/dinos-gql';
import {
  TextInputComponent,
  TextareaComponent,
  ToggleComponent,
} from '@ui-components';
import { DinoErrorsComponent } from '../dino-errors/dino-errors.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'fullstack-dinos-edit-dino',
  standalone: true,
  host: { class: 'block' },
  template: `
    @if (detailsStore.errorsArray().length > 0) {
      <fullstack-dinos-dino-errors
        class="hidden lg:block"
        [errors]="detailsStore.errorsArray()"
      />
    }
    <form #dinoForm="ngForm" (ngSubmit)="onSubmit(dinoForm)">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <ui-text-input
          id="dinoName"
          name="dinoName"
          placeholder="Dinosaur's name"
          labelText="Name"
          [ngModel]="detailsStore.dinosaur().dinoName"
          [errorText]="detailsStore.errors().dinoName"
          [disabled]="detailsStore.editMode()"
        />
        <ui-text-input
          id="genus"
          name="genus"
          placeholder="Dinosaur's genus"
          labelText="Genus"
          [ngModel]="detailsStore.dinosaur().genus"
          [errorText]="detailsStore.errors().genus"
          [disabled]="detailsStore.editMode()"
        />
        <ui-text-input
          id="species"
          name="species"
          labelText="Species"
          [errorText]="detailsStore.errors().species"
          [ngModel]="detailsStore.dinosaur().species"
          placeholder="Dinosaur's species"
          [disabled]="detailsStore.editMode()"
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
      <button
        type="submit"
        class="btn btn-primary"
        [disabled]="detailsStore.showSaveSpinner()"
      >
        @if (detailsStore.showSaveSpinner()) {
          <span class="loading loading-infinity loading-sm"></span>
        }
        Save
      </button>
      <button
        type="button"
        class="btn btn-outline btn-secondary ml-4"
        [routerLink]="cancelLink()"
        (click)="cancel()"
      >
        Cancel
      </button>
    </form>
    @if (detailsStore.networkError()) {
      <fullstack-dinos-toast
        ><strong>Error Saving!</strong
        >{{ detailsStore.networkError() }}</fullstack-dinos-toast
      >
    }
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
    ToastComponent,
  ],
})
export class EditDinoComponent {
  protected readonly detailsStore = inject(EditDinoStore);

  protected cancelLink = computed(() => {
    const id = this.detailsStore.dinosaur().id;

    if (this.detailsStore.editMode() && id) {
      return ['/dinos', id];
    }

    return ['/dinos'];
  });

  protected onSubmit(dinoForm: NgForm): void {
    this.detailsStore.save(dinoForm.value);

    // if (this.detailsStore.editMode()) {
    //   this.detailsStore.updateDino(dinoForm.value);
    //   return;
    // }

    // this.detailsStore.createDino(dinoForm.value);
  }

  protected cancel(): void {
    this.detailsStore.clearErrors();
  }
}
