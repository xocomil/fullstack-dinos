import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DinosCrudStoreService } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'dino-root',
  template: ` <h1>Welcome To DinoAPI</h1>
    <router-outlet />`,
  host: {
    class: 'prose container block px-8 py-4 min-w-full',
  },
  styleUrls: ['./app.component.scss'],
  providers: [DinosCrudStoreService],
})
export class AppComponent {}
