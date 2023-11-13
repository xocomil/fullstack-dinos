import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input as RouteInput,
} from '@angular/core';
import {
  DetailsStore,
  DetailsStoreService,
} from '@fullstack-dinos/angular-dinos/dinos-gql';
import { DisplayDinoComponent } from '../display-dino/display-dino.component';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';

@Component({
  selector: 'fullstack-dinos-details',
  standalone: true,
  template: `
    <!-- <pre>
editMode: {{ detailsSignalStore.editMode() }}
dino: {{ detailsSignalStore.dinosaur() | json }}
id: {{ detailsSignalStore.id() }}
    </pre
    > -->

    @if (detailsSignalStore.editMode()) {
      @defer (on timer(2s),
    interaction(deferTrigger)) {
        <fullstack-dinos-edit-dino />
      } @placeholder {
        <button #deferTrigger type="button" class="btn">Click me...</button>
      } @loading {
        <h1>Loading... (wait for it!)</h1>
      }
    } @else {
      <fullstack-dinos-display-dino />
    }
  `,
  styleUrls: ['./details.component.scss'],
  providers: [DetailsStoreService, DetailsStore],
  imports: [CommonModule, DisplayDinoComponent, EditDinoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  protected readonly detailsStore = inject(DetailsStoreService);
  protected readonly detailsSignalStore = inject(DetailsStore);

  @RouteInput() set dinoId(id: string | undefined) {
    this.detailsStore.setId(id);
    this.detailsSignalStore.setId(id);
  }

  @RouteInput({ transform: booleanAttribute }) set editMode(
    editMode: boolean | undefined,
  ) {
    this.detailsStore.setEditMode(editMode);
    this.detailsSignalStore.setEditMode(editMode);
  }
}
