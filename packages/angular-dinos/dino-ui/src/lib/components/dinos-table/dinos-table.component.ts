import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  BaseDinosaur,
  DinosCrudStoreService,
} from '@fullstack-dinos/angular-dinos/dinos-gql';
import { DeleteButtonComponent } from '../delete-button/delete-button.component';
import { DeleteDinoModalComponent } from '../delete-dino-modal/delete-dino-modal.component';
import { SortButtonComponent } from '../sort-button/sort-button.component';
import { YesNoComponent } from '../yes-no/yes-no.component';

@Component({
  selector: 'fullstack-dinos-dinos-table',
  standalone: true,
  template: `<table class="table table-zebra">
      <thead>
        <tr class="text-lg semi-bold">
          <th scope="col" class="w-1/4">
            Dinosaur
            <fullstack-dinos-sort-button
              [direction]="sortDirection()"
              (sortClick)="sortClick()"
            />
          </th>
          <th scope="col" class="w-3/4">Description</th>
          <th scope="col" class="w-[14ch]">Has Feathers?</th>
          <th scope="col" class="w-[14ch]">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let dinosaur of dinosStore.dinosaurs()"
          class="hover hover:cursor-pointer"
          [routerLink]="['/dinos', dinosaur.id]"
        >
          <td>
            {{ dinosaur.name }}<br /><span class="text-xs italic opacity-50"
              >{{ dinosaur.genus }} {{ dinosaur.species }}</span
            >
          </td>
          <td>{{ dinosaur.description }}</td>
          <td class="flex place-content-center">
            <fullstack-dinos-yes-no [value]="dinosaur.hasFeathers" />
          </td>
          <td>
            <fullstack-dinos-delete-button
              (deleteClick)="deleteDino($event, dinosaur)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <fullstack-dinos-delete-dino-modal />`,
  styleUrls: ['./dinos-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DeleteButtonComponent,
    DeleteDinoModalComponent,
    RouterLink,
    SortButtonComponent,
    YesNoComponent,
  ],
})
export class DinosTableComponent implements OnInit {
  @ViewChild(DeleteDinoModalComponent, { static: true })
  deleteDinoModal!: DeleteDinoModalComponent;
  protected readonly dinosStore = inject(DinosCrudStoreService);
  protected readonly sortDirection = toSignal(this.dinosStore.sortDirection$, {
    initialValue: 'asc' as const,
  });

  ngOnInit(): void {
    this.dinosStore.deleteDino(this.deleteDinoModal.confirmDelete$);
  }

  protected deleteDino(event: MouseEvent, dinosaur: BaseDinosaur) {
    event.stopPropagation();

    this.deleteDinoModal.open(dinosaur);
  }

  protected sortClick() {
    this.dinosStore.toggleSortDirection();
  }
}
