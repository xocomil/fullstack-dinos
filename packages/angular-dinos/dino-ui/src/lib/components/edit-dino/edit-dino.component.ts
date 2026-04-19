import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  submit,
  required,
  minLength,
  min,
  validate,
  disabled,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { DINO_STORE } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { ToggleComponent } from '@ui-components';
import { DinoErrorsComponent } from '../dino-errors/dino-errors.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'fullstack-dinos-edit-dino',
  host: { class: 'block' },
  template: `
    @if (networkError()) {
      <fullstack-dinos-dino-errors
        class="hidden lg:block"
        [errors]="[networkError()!]"
      />
    }
    <form (submit)="onSubmit(); $event.preventDefault()">
      <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label class="floating-label fieldset" for="dinoName">
          <span>Name</span>
          <input
            id="dinoName"
            [formField]="dinoForm.dinoName"
            placeholder="Dinosaur's name"
          />
          @if (dinoForm.dinoName().touched() && dinoForm.dinoName().errors().length) {
            <span class="error">{{ dinoForm.dinoName().errors()[0].message }}</span>
          }
        </label>

        <label class="floating-label fieldset" for="genus">
          <span>Genus</span>
          <input
            id="genus"
            [formField]="dinoForm.genus"
            placeholder="Dinosaur's genus"
          />
          @if (dinoForm.genus().touched() && dinoForm.genus().errors().length) {
            <span class="error">{{ dinoForm.genus().errors()[0].message }}</span>
          }
        </label>

        <label class="floating-label fieldset" for="species">
          <span>Species</span>
          <input
            id="species"
            [formField]="dinoForm.species"
            placeholder="Dinosaur's species"
          />
          @if (dinoForm.species().touched() && dinoForm.species().errors().length) {
            <span class="error">{{ dinoForm.species().errors()[0].message }}</span>
          }
        </label>

        <label class="floating-label fieldset md:col-span-2" for="description">
          <span>Description</span>
          <textarea
            id="description"
            class="textarea-bordered h-24 min-w-full"
            [formField]="dinoForm.description"
            placeholder="Description"
          ></textarea>
          <p class="label not-prose">Make it jazzy!</p>
          @if (dinoForm.description().touched() && dinoForm.description().errors().length) {
            <span class="error">{{ dinoForm.description().errors()[0].message }}</span>
          }
        </label>

        <ui-toggle
          id="hasFeathers"
          labelText="Has Feathers?"
          [formField]="dinoForm.hasFeathers"
        />

        <label class="floating-label fieldset" for="heightInMeters">
          <span>Height (m)</span>
          <input
            id="heightInMeters"
            type="number"
            [formField]="dinoForm.heightInMeters"
            placeholder="Dinosaur's height in meters"
          />
          @if (dinoForm.heightInMeters().touched() && dinoForm.heightInMeters().errors().length) {
            <span class="error">{{ dinoForm.heightInMeters().errors()[0].message }}</span>
          }
        </label>

        <label class="floating-label fieldset" for="weightInKilos">
          <span>Weight (kg)</span>
          <input
            id="weightInKilos"
            type="number"
            [formField]="dinoForm.weightInKilos"
            placeholder="Dinosaur's weight in kilograms"
          />
          @if (dinoForm.weightInKilos().touched() && dinoForm.weightInKilos().errors().length) {
            <span class="error">{{ dinoForm.weightInKilos().errors()[0].message }}</span>
          }
        </label>

        <label class="floating-label fieldset" for="imageUrl">
          <span>URL to Image</span>
          <input
            id="imageUrl"
            [formField]="dinoForm.imageUrl"
            placeholder="URL to Image"
          />
          @if (dinoForm.imageUrl().touched() && dinoForm.imageUrl().errors().length) {
            <span class="error">{{ dinoForm.imageUrl().errors()[0].message }}</span>
          }
        </label>
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        [disabled]="detailsStore.loading() || dinoForm().invalid()"
      >
        @if (detailsStore.loading()) {
          <span class="loading loading-infinity loading-sm"></span>
        }
        Save
      </button>
      <button
        type="button"
        class="btn btn-outline btn-secondary ml-4"
        [routerLink]="detailsStore.cancelLink()"
        (click)="cancel()"
      >
        Cancel
      </button>
    </form>
    @if (detailsStore.networkError()) {
      <fullstack-dinos-toast>
        <strong>Error Saving!</strong>
        {{ detailsStore.networkError() }}
      </fullstack-dinos-toast>
    }
  `,
  styleUrls: ['./edit-dino.component.scss'],
  imports: [
    DinoErrorsComponent,
    FormField,
    RouterLink,
    ToggleComponent,
    ToastComponent,
  ],
})
export class EditDinoComponent {
  protected readonly detailsStore = inject(DINO_STORE);

  protected readonly dinoModel = signal({
    dinoName: '',
    genus: '',
    species: '',
    description: '',
    hasFeathers: false,
    heightInMeters: 0,
    weightInKilos: 0,
    imageUrl: '',
    trivia: [] as string[],
  });

  protected readonly networkError = computed(() => this.detailsStore.networkError());

  protected readonly dinoForm = form(this.dinoModel, (s) => {
    // Name, genus, species validation
    required(s.dinoName, { message: 'Dinosaur name is required.' });
    minLength(s.dinoName, 3, { message: 'Name must be at least 3 characters long.' });

    required(s.genus, { message: 'Genus is required.' });
    minLength(s.genus, 3, { message: 'Genus must be at least 3 characters long.' });

    required(s.species, { message: 'Species is required.' });
    minLength(s.species, 3, { message: 'Species must be at least 3 characters long.' });

    // Description: only validate if non-empty
    validate(s.description, ({ value }) => {
      const val = value();
      if (val && val.length > 0 && val.length < 3) {
        return {
          kind: 'minLength',
          message: 'Please provide a better description. It should be at least 3 characters!',
        };
      }
      return undefined;
    });

    // Numeric fields
    required(s.heightInMeters, { message: 'Height in meters is required.' });
    validate(s.heightInMeters, ({ value }) => {
      if (value() <= 0) {
        return { kind: 'min', message: 'Height in meters must be greater than 0.' };
      }
      return undefined;
    });

    required(s.weightInKilos, { message: 'Weight in kilos is required.' });
    validate(s.weightInKilos, ({ value }) => {
      if (value() <= 0) {
        return { kind: 'min', message: 'Weight in kilos must be greater than 0.' };
      }
      return undefined;
    });

    // Image URL: only validate if non-empty
    validate(s.imageUrl, ({ value }) => {
      const val = value();
      if (val && val.length > 0) {
        try {
          new URL(val);
        } catch {
          return { kind: 'url', message: 'Image URL is not a valid URL.' };
        }
      }
      return undefined;
    });

    // Disable name/genus/species in edit mode
    disabled(s.dinoName, () => this.detailsStore.editMode());
    disabled(s.genus, () => this.detailsStore.editMode());
    disabled(s.species, () => this.detailsStore.editMode());
  });

  constructor() {
    // Sync store dinosaur data into the local model signal
    effect(() => {
      const dino = this.detailsStore.dinosaur();
      if (dino) {
        this.dinoModel.set({
          dinoName: dino.dinoName ?? '',
          genus: dino.genus ?? '',
          species: dino.species ?? '',
          description: dino.description ?? '',
          hasFeathers: dino.hasFeathers ?? false,
          heightInMeters: dino.heightInMeters ?? 0,
          weightInKilos: dino.weightInKilos ?? 0,
          imageUrl: dino.imageUrl ?? '',
          trivia: dino.trivia ?? [],
        });
      }
    });
  }

  protected onSubmit(): void {
    submit(this.dinoForm, async () => {
      this.detailsStore.save(this.dinoModel());
    });
  }

  protected cancel(): void {
    // Reset network error state if store supports it
    if ('clearErrors' in this.detailsStore) {
      (this.detailsStore as any).clearErrors();
    }
  }
}
