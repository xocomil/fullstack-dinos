import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { DisplayDinoComponent } from '../display-dino/display-dino.component';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';

@Component({
  selector: 'fullstack-dinos-details',
  standalone: true,
  template: `
    <fullstack-dinos-edit-dino
      *ngIf="detailsStore.editMode(); else displayMode"
    />
    <ng-template #displayMode>
      <fullstack-dinos-display-dino />
    </ng-template>
  `,
  styleUrls: ['./details.component.scss'],
  providers: [DetailsStoreService],
  imports: [CommonModule, DisplayDinoComponent, EditDinoComponent],
})
export class DetailsComponent {
  protected readonly detailsStore = inject(DetailsStoreService);

  @Input() set dinoId(id: string | undefined) {
    this.detailsStore.setId(id);
  }

  @Input() set editMode(editMode: boolean | undefined) {
    this.detailsStore.setEditMode(editMode);
  }
}
