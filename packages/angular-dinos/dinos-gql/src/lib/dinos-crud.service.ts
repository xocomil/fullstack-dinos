import { inject, Injectable } from '@angular/core';
import { Suspense, suspensify } from '@jscutlery/operators';
import { lastValueFrom, map, Observable } from 'rxjs';
import {
  AllDinosaursGQL,
  CreateDinoGQL,
  DeleteDinoGQL,
  DinoGQL,
  DinosaurCreateInput,
  UpdateDinoGQL,
} from './graphql/generated';
import { BaseDinosaur, Dinosaur, UpdateDinosaur } from './models/dinosaur';

@Injectable({
  providedIn: 'root',
})
export class DinosCrudService {
  readonly #allDinosGql = inject(AllDinosaursGQL);
  readonly #getDinoGql = inject(DinoGQL);
  readonly #updateDinoGql = inject(UpdateDinoGQL);
  readonly #createDinoGql = inject(CreateDinoGQL);
  readonly #deleteDinoGql = inject(DeleteDinoGQL);

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

  getDinoPromise(id: string): Promise<Suspense<Dinosaur>> {
    return lastValueFrom(this.getDino(id));
  }

  getDino(id: string): Observable<Suspense<Dinosaur>> {
    return this.#getDinoGql
      .fetch({
        where: { id },
      })
      .pipe(
        map((apolloDino) => apolloDino.data.dinosaur),
        map((dino) => {
          if (!dino) {
            throw new Error(`Dinosaur with id ${id} not found.`);
          }

          return convertGqlDinoToDinosaur(dino);
        }),
        suspensify(),
      );
  }

  updateDino(
    dino: UpdateDinosaur,
    id: string,
  ): Observable<Suspense<Dinosaur | null | undefined>> {
    return this.#updateDinoGql
      .mutate(
        {
          data: dino,
          where: { id },
        },
        {
          update(cache) {
            cache.evict({ fieldName: 'allDinosaurs' });
          },
        },
      )
      .pipe(
        map((mutationResult) => mutationResult.data?.updateDino),
        map((gqlDino) =>
          gqlDino ? convertGqlDinoToDinosaur(gqlDino) : gqlDino,
        ),
        suspensify(),
      );
  }

  create(dino: Dinosaur): Observable<Suspense<Dinosaur | null | undefined>> {
    return this.#createDinoGql
      .mutate(
        {
          dino: convertDinosaurToCreateDino(dino),
        },
        {
          update(cache) {
            cache.evict({ fieldName: 'allDinosaurs' });
          },
        },
      )
      .pipe(
        map((mutationResult) => mutationResult.data?.createDino),
        map((gqlDino) =>
          gqlDino ? convertGqlDinoToDinosaur(gqlDino) : gqlDino,
        ),
        suspensify(),
      );
  }

  deleteDino(dinoId: string): Observable<Suspense<string | null | undefined>> {
    return this.#deleteDinoGql
      .mutate(
        {
          where: { id: dinoId },
        },
        {
          update(cache) {
            cache.evict({ fieldName: 'allDinosaurs' });
          },
        },
      )
      .pipe(
        map((mutationResult) => mutationResult.data?.deleteDino?.id),
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
  };
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

function convertDinosaurToCreateDino({
  dinoName: name,
  ...dino
}: Dinosaur): DinosaurCreateInput {
  return { ...dino, name };
}
