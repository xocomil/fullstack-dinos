import { inject, Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { BaseDinosaur } from './models/dinosaur';

@Injectable({
  providedIn: 'root',
})
export class DinosCrudService {
  readonly #apollo = inject(Apollo);

  getDinosTable(): QueryRef<{ allDinosaurs: BaseDinosaur[] }> {
    return this.#apollo.watchQuery({
      query: gql<{ allDinosaurs: BaseDinosaur[] }, void>`
        query AllDinosaurs {
          allDinosaurs {
            id
            name
            genus
            species
            hasFeathers
            description
          }
        }
      `,
    });
  }
}
