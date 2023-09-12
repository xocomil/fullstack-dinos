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
  template: `<div class="flex justify-end">
      <fullstack-dinos-add-button (click)="addDino()" />
    </div>
    <fullstack-dinos-dinos-table /> `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AddButtonComponent, DinosTableComponent, JsonPipe],
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
}
