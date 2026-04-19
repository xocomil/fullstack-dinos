import { Component, effect, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  submit,
  disabled,
  validateStandardSchema,
  applyWhen,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import {
  createEmptyDino,
  DINO_STORE,
  dinoParser,
  updateDinoParser,
} from '@fullstack-dinos/angular-dinos/dinos-gql';
import { ToggleComponent } from '@ui-components';
import { DinoErrorsComponent } from '../dino-errors/dino-errors.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'fullstack-dinos-edit-dino',
  host: { class: 'block' },
  template: `
    @if (detailsStore.networkError()) {
      <fullstack-dinos-dino-errors
        class="hidden lg:block"
        [errors]="[detailsStore.networkError()!]"
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
          @if (
            dinoForm.dinoName().touched() && dinoForm.dinoName().errors().length
          ) {
            <span class="error">
              {{ dinoForm.dinoName().errors()[0].message }}
            </span>
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
            <span class="error">
              {{ dinoForm.genus().errors()[0].message }}
            </span>
          }
        </label>

        <label class="floating-label fieldset" for="species">
          <span>Species</span>
          <input
            id="species"
            [formField]="dinoForm.species"
            placeholder="Dinosaur's species"
          />
          @if (
            dinoForm.species().touched() && dinoForm.species().errors().length
          ) {
            <span class="error">
              {{ dinoForm.species().errors()[0].message }}
            </span>
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
          @if (
            dinoForm.description().touched() &&
            dinoForm.description().errors().length
          ) {
            <span class="error">
              {{ dinoForm.description().errors()[0].message }}
            </span>
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
          @if (
            dinoForm.heightInMeters().touched() &&
            dinoForm.heightInMeters().errors().length
          ) {
            <span class="error">
              {{ dinoForm.heightInMeters().errors()[0].message }}
            </span>
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
          @if (
            dinoForm.weightInKilos().touched() &&
            dinoForm.weightInKilos().errors().length
          ) {
            <span class="error">
              {{ dinoForm.weightInKilos().errors()[0].message }}
            </span>
          }
        </label>

        <label class="floating-label fieldset" for="imageUrl">
          <span>URL to Image</span>
          <input
            id="imageUrl"
            [formField]="dinoForm.imageUrl"
            placeholder="URL to Image"
          />
          @if (
            dinoForm.imageUrl().touched() && dinoForm.imageUrl().errors().length
          ) {
            <span class="error">
              {{ dinoForm.imageUrl().errors()[0].message }}
            </span>
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

  protected readonly dinoModel = signal(createEmptyDino());

  protected readonly dinoForm = form(this.dinoModel, (s) => {
    applyWhen(
      s,
      () => this.detailsStore.editMode(),
      (schemaPath) => {
        validateStandardSchema(schemaPath, updateDinoParser);
      },
    );

    applyWhen(
      s,
      () => !this.detailsStore.editMode(),
      (schemaPath) => {
        validateStandardSchema(schemaPath, dinoParser);
      },
    );

    disabled(s.dinoName, () => this.detailsStore.editMode());
    disabled(s.genus, () => this.detailsStore.editMode());
    disabled(s.species, () => this.detailsStore.editMode());
  });

  constructor() {
    // TODO: WTF??? This could just bind to the signal store right???
    // We need to fix the resource for the edit dino so we don't have to do this
    // and can just use a delegatedSignal from the store.
    effect(() => {
      const dino = this.detailsStore.dinosaur();

      if (dino) {
        this.dinoModel.set(dino);
      }
    });
  }

  protected onSubmit(): void {
    submit(this.dinoForm, async () => {
      this.detailsStore.save(this.dinoModel());
    });
  }

  protected cancel(): void {
    console.log('cancel()');
  }
}
