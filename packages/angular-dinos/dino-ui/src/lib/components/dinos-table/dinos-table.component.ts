import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DinosCrudStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  selector: 'fullstack-dinos-dinos-table',
  standalone: true,
  imports: [CommonModule],
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
        <td
          [class.text-success]="dinosaur.hasFeathers"
          class="text-error flex place-content-center"
        >
          <svg
            *ngIf="dinosaur.hasFeathers"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            *ngIf="!dinosaur.hasFeathers"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </td>
      </tr>
    </tbody>
  </table> `,
  styleUrls: ['./dinos-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DinosTableComponent {
  protected readonly dinosStore = inject(DinosCrudStoreService);
}
