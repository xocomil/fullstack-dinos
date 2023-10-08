import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  Input as RouteInput,
  signal,
} from '@angular/core';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { DisplayDinoComponent } from '../display-dino/display-dino.component';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';

@Component({
  selector: 'fullstack-dinos-details',
  standalone: true,
  template: `
    @if (detailsStore.editMode()) { @defer (when isVisible()) {
    <fullstack-dinos-edit-dino />
    } @placeholder (minimum 1s) {
    <button #deferTrigger type="button" class="btn" (click)="setReady()">
      Click me...
    </button>
    } @loading {
    <h1>Loading... (wait for it!)</h1>
    } } @else {
    <fullstack-dinos-display-dino />
    }
  `,
  styleUrls: ['./details.component.scss'],
  providers: [DetailsStoreService],
  imports: [CommonModule, DisplayDinoComponent, EditDinoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  readonly #cdr = inject(ChangeDetectorRef);
  readonly #ready = signal(false);
  protected readonly isVisible = computed(() => {
    return this.#ready() && this.detailsStore.dinosaur().id !== undefined;
  });

  constructor() {
    effect(() => {
      console.log('DetailsComponent#isVisible', this.isVisible());

      setTimeout(() => {
        this.#cdr.markForCheck();
      }, 42);
    });
  }

  protected readonly detailsStore = inject(DetailsStoreService);

  @RouteInput() set dinoId(id: string | undefined) {
    this.detailsStore.setId(id);
  }

  @RouteInput() set editMode(editMode: boolean | undefined) {
    this.detailsStore.setEditMode(editMode);
  }

  protected setReady() {
    this.#ready.set(true);
  }
}
