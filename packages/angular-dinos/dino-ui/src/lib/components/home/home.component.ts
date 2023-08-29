import { JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { DinosCrudStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { DinosTableComponent } from '../dinos-table/dinos-table.component';

@Component({
  selector: 'fullstack-dinos-home',
  standalone: true,
  template: `
    <button type="button" class="btn btn-primary" (click)="getDinos()">
      Get Dinos
    </button>
    <fullstack-dinos-dinos-table />
  `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DinosTableComponent, JsonPipe],
})
export class HomeComponent implements AfterViewInit {
  protected readonly dinosStore = inject(DinosCrudStoreService);

  ngAfterViewInit(): void {
    this.getDinos();
  }

  protected getDinos() {
    this.dinosStore.getTableDinos();
  }
}
