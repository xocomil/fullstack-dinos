import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DinosCrudStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  standalone: true,
  imports: [RouterModule, JsonPipe],
  selector: 'dino-root',
  template: ` <h1>Welcome To DinoAPI</h1>
    <button type="button" class="btn btn-primary" (click)="getDinos()">
      Get Dinos</button
    ><br />
    <strong>Dinos:</strong><br />
    <pre>{{ dinosStore.dinosaurs() | json }}</pre>
    <router-outlet />`,
  host: {
    class: 'prose container block px-8 py-4 min-w-full',
  },
  styleUrls: ['./app.component.scss'],
  providers: [DinosCrudStoreService],
})
export class AppComponent {
  protected readonly dinosStore = inject(DinosCrudStoreService);

  protected getDinos() {
    this.dinosStore.getTableDinos();
  }
}
