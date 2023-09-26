import { inject, Injectable } from '@angular/core';
import { Suspense, suspensify } from '@jscutlery/operators';
import { Apollo, gql } from 'apollo-angular';
import { from, map, Observable, switchMap } from 'rxjs';
import { BaseDinosaur, Dinosaur, UpdateDinosaur } from './models/dinosaur';

const allDinosQuery = gql<
  { allDinosaurs: BaseDinosaur[] },
  { direction: 'asc' | 'desc' }
>`
  query AllDinosaurs($direction: String) {
    allDinosaurs(direction: $direction) {
      id
      name
      genus
      species
      hasFeathers
      description
    }
  }
`;

const dinoDetailsFragment = gql`
  fragment DinoDetails on Dinosaur {
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
`;

@Injectable({
  providedIn: 'root',
})
export class DinosCrudService {
  readonly #apollo = inject(Apollo);

  getDinosTable(
    direction: 'asc' | 'desc',
  ): Observable<Suspense<{ allDinosaurs: BaseDinosaur[] }>> {
    return this.#apollo
      .query({
        query: allDinosQuery,
        variables: { direction },
      })
      .pipe(
        map((apolloDinos) => apolloDinos.data),
        suspensify(),
      );
  }

  getDino(id: string): Observable<Suspense<Dinosaur>> {
    return this.#apollo
      .query({
        query: gql<{ dinosaur: Dinosaur }, { where: { id: string } }>`
          query Dino($where: DinosaurWhereUniqueInput!) {
            dinosaur(where: $where) {
              ...DinoDetails
            }
          }
          ${dinoDetailsFragment}
        `,
        variables: { where: { id } },
      })
      .pipe(
        map((apolloDino) => apolloDino.data.dinosaur),
        suspensify(),
      );
  }

  updateDino(
    dino: UpdateDinosaur,
    id: string,
  ): Observable<Suspense<Dinosaur | null | undefined>> {
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
              ...DinoDetails
            }
          }
          ${dinoDetailsFragment}
        `,
        variables: {
          data: dino,
          where: { id },
        },
      })
      .pipe(
        map((mutationResult) => mutationResult.data),
        suspensify(),
      );
  }

  create(dino: Dinosaur): Observable<Suspense<Dinosaur | null | undefined>> {
    return this.#apollo
      .mutate({
        mutation: gql<Dinosaur, { dino: Dinosaur }>`
          mutation CreateDino($dino: DinosaurCreateInput!) {
            createDino(dino: $dino) {
              id
            }
          }
        `,
        variables: {
          dino: dino,
        },
      })
      .pipe(
        switchMap((response) =>
          from(this.#apollo.client.resetStore()).pipe(map(() => response)),
        ),
        map((mutationResult) => mutationResult.data),
        suspensify(),
      );
  }

  deleteDino(dinoId: string): Observable<Suspense<string | null | undefined>> {
    return this.#apollo
      .mutate({
        mutation: gql<string, { where: { id: string } }>`
          mutation DeleteDino($where: DinosaurWhereUniqueInput!) {
            deleteDino(where: $where) {
              id
            }
          }
        `,
        variables: {
          where: { id: dinoId },
        },
      })
      .pipe(
        switchMap((response) =>
          from(this.#apollo.client.resetStore()).pipe(map(() => response)),
        ),
        map((mutationResult) => mutationResult.data),
        suspensify(),
      );
  }
}
