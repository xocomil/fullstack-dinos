import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { DinosCrudService } from '@fullstack-dinos/angular-dinos/dinos-gql';

@Component({
  standalone: true,
  imports: [RouterModule, JsonPipe],
  selector: 'dino-root',
  template: ` <pre>{{ dinos() | json }}</pre>
    <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly #dinosCrudService = inject(DinosCrudService);
  readonly #dinoQuery = this.#dinosCrudService.getAllDinos();

  protected dinos = toSignal(this.#dinoQuery.valueChanges);

  ngOnInit(): void {
    this.#dinoQuery.startPolling(1000);
  }
}
