import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input as RouteInput,
} from '@angular/core';
import {
  EditDinoStore,
  provideEditDinoStore,
} from '@fullstack-dinos/angular-dinos/dinos-gql';
import { DisplayDinoComponent } from '../display-dino/display-dino.component';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';
import { OpenaiComponent } from '../openai/openai.component';

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
      @defer (when detailsStore.editMode()) {
        <fullstack-dinos-edit-dino />
      } @placeholder {
        <button #deferTrigger type="button" class="btn">Click me...</button>
      } @loading {
        <h1>Loading... (wait for it!)</h1>
      }
    } @else if (detailsStore.openAiMode()) {
      <fullstack-dinos-openai />
    } @else {
      <fullstack-dinos-display-dino />
    }
  `,
  styleUrls: ['./details.component.scss'],
  providers: [provideEditDinoStore()],
  imports: [
    CommonModule,
    DisplayDinoComponent,
    EditDinoComponent,
    OpenaiComponent,
  ],
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

  @RouteInput({ transform: booleanAttribute }) set openAiMode(
    openAiMode: boolean | undefined,
  ) {
    this.detailsStore.newOpenAiMode(openAiMode);
  }
}
