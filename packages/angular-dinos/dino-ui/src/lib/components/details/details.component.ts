import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input as RouteInput,
} from '@angular/core';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { DisplayDinoComponent } from '../display-dino/display-dino.component';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';

@Component({
  selector: 'fullstack-dinos-details',
  standalone: true,
  template: `
    @defer (on immediate) {
    <fullstack-dinos-edit-dino />
    } @if (detailsStore.editMode()) { @defer (on timer(2s),
    interaction(deferTrigger)) {
    <fullstack-dinos-edit-dino />
    } @placeholder (minimum 1s) {
    <button #deferTrigger type="button" class="btn">Click me...</button>
    } @loading (after 300ms; minimum 1s) {
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
  protected readonly detailsStore = inject(DetailsStoreService);

  @RouteInput() set dinoId(id: string | undefined) {
    this.detailsStore.setId(id);
  }

  @RouteInput() set editMode(editMode: boolean | undefined) {
    this.detailsStore.setEditMode(editMode);
  }
}
