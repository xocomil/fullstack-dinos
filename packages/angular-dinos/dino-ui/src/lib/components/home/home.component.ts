import { JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { DinosCrudStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { AddButtonComponent } from '../add-button/add-button.component';
import { DinosTableComponent } from '../dinos-table/dinos-table.component';

@Component({
  selector: 'fullstack-dinos-home',
  standalone: true,
  template: `<div class="flex justify-end gap-4">
      <select
        class="select select-bordered select-sm w-1/4"
        (change)="filterHasFeathers($event)"
        [value]="dinosStore.hasFeathersFilter()"
      >
        <option value="">No filter</option>
        <option value="true">Has feathers</option>
        <option value="false">No feathers</option>
      </select>
      <fullstack-dinos-add-button (click)="addDino()" />
    </div>
    <fullstack-dinos-dinos-table /> `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AddButtonComponent, DinosTableComponent, JsonPipe],
  providers: [DinosCrudStoreService],
  host: {
    class: 'mt-2',
  },
})
export class HomeComponent implements AfterViewInit {
  readonly #router = inject(Router);
  protected readonly dinosStore = inject(DinosCrudStoreService);

  ngAfterViewInit(): void {
    this.#getDinos();
  }

  addDino() {
    this.#router.navigate(['/dinos', 'add']);
  }

  #getDinos() {
    this.dinosStore.getTableDinos();
  }

  protected filterHasFeathers(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.dinosStore.filterHasFeathers(value);
  }
}
