import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { BaseDinosaur, Dinosaur, UpdateDinosaur } from './models/dinosaur';

@Injectable({
  providedIn: 'root',
})
export class DinosCrudService {
  readonly #apollo = inject(Apollo);

  getDinosTable(): Observable<{ allDinosaurs: BaseDinosaur[] }> {
    return this.#apollo
      .query({
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
      })
      .pipe(map((apolloDinos) => apolloDinos.data));
  }

  getDino(id: string): Observable<Dinosaur> {
    return this.#apollo
      .query({
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
      })
      .pipe(map((apolloDino) => apolloDino.data.dinosaur));
  }

  updateDino(
    dino: UpdateDinosaur,
    id: string,
  ): Observable<Dinosaur | null | undefined> {
    return this.#apollo
      .mutate({
        mutation: gql<
          Dinosaur,
          { data: UpdateDinosaur; where: { id?: string; name?: string } }
        >`
          mutation Mutation(
            $data: DinosaurUpdateInput!
            $where: DinosaurWhereUniqueInput!
          ) {
            updateDino(data: $data, where: $where) {
              id
              description
              genus
              hasFeathers
              heightInMeters
              imageUrl
              name
              species
              trivia
              updatedAt
              weightInKilos
            }
          }
        `,
        variables: {
          data: dino,
          where: { id },
        },
      })
      .pipe(map((mutationResult) => mutationResult.data));
  }

  create(dino: Dinosaur): Observable<Dinosaur | null | undefined> {
    return this.#apollo
      .mutate({
        mutation: gql<Dinosaur, { dino: Dinosaur }>`
          mutation CreateDino($dino: DinosaurCreateInput!) {
            createDino(dino: $dino) {
              description
              genus
              hasFeathers
              heightInMeters
              id
              imageUrl
              name
              species
              trivia
              updatedAt
              weightInKilos
            }
          }
        `,
        variables: {
          dino: dino,
        },
      })
      .pipe(map((mutationResult) => mutationResult.data));
  }
}
