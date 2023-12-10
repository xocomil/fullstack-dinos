import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input as RouteInput,
} from '@angular/core';
import { EditDinoStore } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { DisplayDinoComponent } from '../display-dino/display-dino.component';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';

@Component({
  selector: 'fullstack-dinos-details',
  standalone: true,
  template: `
    <!-- <pre>
editMode: {{ detailsStore.editMode() }}
dino: {{ detailsStore.dinosaur() | json }}
id: {{ detailsStore.id() }}
    </pre
    > -->

    @if (detailsStore.editMode()) {
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
  providers: [EditDinoStore],
  imports: [CommonModule, DisplayDinoComponent, EditDinoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  protected readonly detailsStore = inject(EditDinoStore);

  @RouteInput() set dinoId(id: string | undefined) {
    this.detailsStore.setId(id);
  }

  @RouteInput({ transform: booleanAttribute }) set editMode(
    editMode: boolean | undefined,
  ) {
    this.detailsStore.setEditMode(editMode);
  }
}
