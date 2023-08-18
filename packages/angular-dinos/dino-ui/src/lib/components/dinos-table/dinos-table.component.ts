import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DinosCrudStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { YesNoComponent } from '../yes-no/yes-no.component';

@Component({
  selector: 'fullstack-dinos-dinos-table',
  standalone: true,
  template: `<table class="table table-zebra">
    <thead>
      <tr class="text-lg semi-bold">
        <th scope="col" class="w-1/4">Dinosaur</th>
        <th scope="col" class="w-3/4">Description</th>
        <th scope="col" class="w-[14ch]">Has Feathers?</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let dinosaur of dinosStore.dinosaurs()" class="hover">
        <td>
          {{ dinosaur.name }}<br /><span class="text-xs italic opacity-50"
            >{{ dinosaur.genus }} {{ dinosaur.species }}</span
          >
        </td>
        <td>{{ dinosaur.description }}</td>
        <td class="flex place-content-center">
          <fullstack-dinos-yes-no [value]="dinosaur.hasFeathers" />
        </td>
      </tr>
    </tbody>
  </table> `,
  styleUrls: ['./dinos-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, YesNoComponent],
})
export class DinosTableComponent {
  protected readonly dinosStore = inject(DinosCrudStoreService);
}
