import { inject, Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Dinosaur } from './models/dinosaur';

@Injectable({
  providedIn: 'root',
})
export class DinosCrudService {
  readonly #apollo = inject(Apollo);

  getAllDinos(): QueryRef<Dinosaur> {
    return this.#apollo.watchQuery({
      query: gql<Dinosaur, void>`
        query AllDinosaurs {
          allDinosaurs {
            genus
            hasFeathers
            id
            name
            species
            description
            trivia
          }
        }
      `,
    });
  }
}
