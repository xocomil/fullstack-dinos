import { inject, Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { BaseDinosaur, Dinosaur } from './models/dinosaur';

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

  getDino(id: string): Observable<ApolloQueryResult<{ dinosaur: Dinosaur }>> {
    return this.#apollo.query({
      query: gql<{ dinosaur: Dinosaur }, { where: { id: string } }>`
        query Dino($where: DinosaurWhereUniqueInput!) {
          dinosaur(where: $where) {
            id
            name
            genus
            species
            description
            hasFeathers
            heightInMeters
            weightInKilos
            imageUrl
            trivia
            updatedAt
          }
        }
      `,
      variables: { where: { id } },
    });
  }
}
