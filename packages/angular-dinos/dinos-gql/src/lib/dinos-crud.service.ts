import { inject, Injectable } from '@angular/core';
import { Suspense, suspensify } from '@jscutlery/operators';
import { gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { AllDinosaursGQL, DinoGQL } from './graphql/generated';
import { BaseDinosaur, Dinosaur, UpdateDinosaur } from './models/dinosaur';

@Injectable({
  providedIn: 'root',
})
export class DinosCrudService {
  readonly #allDinosGql = inject(AllDinosaursGQL);
  readonly #getDinoGql = inject(DinoGQL);

  getDinosTable(
    direction: 'asc' | 'desc',
    hasFeathers: boolean | undefined,
  ): Observable<Suspense<{ allDinosaurs: BaseDinosaur[] }>> {
    return this.#allDinosGql
      .fetch({
        direction,
        hasFeathers,
      })
      .pipe(
        map((apolloDinos) => apolloDinos.data.allDinosaurs),
        map((dinos) => dinos ?? []),
        map((dinos) => ({
          allDinosaurs: dinos.map(convertGqlDinoToBaseDinosaur),
        })),
        suspensify(),
      );
  }

  getDino(id: string): Observable<Suspense<Dinosaur | null | undefined>> {
    return this.#getDinoGql
      .fetch({
        where: { id },
      })
      .pipe(
        map((apolloDino) => apolloDino.data.dinosaur),
        map((dino) => (dino ? convertGqlDinoToDinosaur(dino) : dino)),
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
        update(cache) {
          cache.evict({ fieldName: 'allDinosaurs' });
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
              ...DinoDetails
            }
          }
          ${dinoDetailsFragment}
        `,
        variables: {
          dino: dino,
        },
        update(cache) {
          cache.evict({ fieldName: 'allDinosaurs' });
        },
      })
      .pipe(
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
        update(cache) {
          cache.evict({ fieldName: 'allDinosaurs' });
        },
      })
      .pipe(
        map((mutationResult) => mutationResult.data),
        suspensify(),
      );
  }
}

type DbDino = Omit<Dinosaur, 'dinoName' | 'trivia'> & {
  name: string;
  trivia?: string[] | null | undefined;
};
type DbBaseDino = Omit<BaseDinosaur, 'dinoName'> & { name: string };

function convertGqlDinoToDinosaur({ name, trivia, ...dino }: DbDino): Dinosaur {
  return {
    ...dino,
    dinoName: name ?? '',
    trivia: trivia ?? [],
  } as Dinosaur;
}

function convertGqlDinoToBaseDinosaur({
  name,
  ...dino
}: DbBaseDino): BaseDinosaur {
  return {
    ...dino,
    dinoName: name ?? '',
  };
}
