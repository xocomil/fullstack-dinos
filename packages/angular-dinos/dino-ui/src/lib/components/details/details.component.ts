import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { DetailsStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  selector: 'fullstack-dinos-details',
  standalone: true,
  imports: [CommonModule],
  template: `<p>details works! {{ detailsStore.id() }}</p>
    <br />
    <pre>{{ detailsStore.dinosaur() | json }}</pre>`,
  styleUrls: ['./details.component.scss'],
  providers: [DetailsStoreService],
})
export class DetailsComponent {
  protected readonly detailsStore = inject(DetailsStoreService);

  @Input() set dinoId(id: string | undefined) {
    if (id == null) {
      return;
    }

    this.detailsStore.setId(id);
  }
}
