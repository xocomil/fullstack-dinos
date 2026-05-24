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
  ): Observable<{ allDinosaurs: BaseDinosaur[] }> {
    return this.#allDinosGql
      .fetch({
        variables: {
          direction,
          hasFeathers,
        },
      })
      .pipe(
        map((apolloDinos) => apolloDinos.data?.allDinosaurs),
        map((dinos) => dinos ?? []),
        map((dinos) => ({
          allDinosaurs: dinos.map(convertGqlDinoToBaseDinosaur),
        })),
      );
  }

  getDinoPromise(id: string): Promise<Dinosaur> {
    return lastValueFrom(this.getDino(id));
  }

  getDino(id: string): Observable<Dinosaur> {
    return this.#getDinoGql
      .fetch({
        variables: {
          where: { id },
        },
      })
      .pipe(
        map((apolloDino) => apolloDino.data?.dinosaur),
        map((dino) => {
          if (!dino) {
            throw new Error(`Dinosaur with id ${id} not found.`);
          }

          return convertGqlDinoToDinosaur(dino);
        }),
      );
  }

  updateDino(
    dino: UpdateDinosaur,
    id: string,
  ): Observable<Suspense<Dinosaur | null | undefined>> {
    return this.#updateDinoGql
      .mutate({
        variables: {
          data: dino,
          where: { id },
        },
        update(cache) {
          cache.evict({ fieldName: 'allDinosaurs' });
        },
      })
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
      .mutate({
        variables: {
          dino: convertDinosaurToCreateDino(dino),
        },
        update(cache) {
          cache.evict({ fieldName: 'allDinosaurs' });
        },
      })
      .pipe(
        map((mutationResult) => mutationResult.data?.createDino),
        map((gqlDino) =>
          gqlDino ? convertGqlDinoToDinosaur(gqlDino) : gqlDino,
        ),
        suspensify(),
      );
  }

  deleteDino(dinoId: string): Observable<string | null | undefined> {
    return this.#deleteDinoGql
      .mutate({
        variables: {
          where: { id: dinoId },
        },
        update(cache) {
          cache.evict({ fieldName: 'allDinosaurs' });
        },
      })
      .pipe(map((mutationResult) => mutationResult.data?.deleteDino?.id));
  }
}

type DbDino = Omit<
  Dinosaur,
  'dinoName' | 'trivia' | 'description' | 'imageUrl'
> & {
  name: string;
  trivia?: string[] | null | undefined;
  description?: string | null | undefined;
  imageUrl?: string | null | undefined;
};
type DbBaseDino = Omit<BaseDinosaur, 'dinoName' | 'description'> & {
  name: string;
  description?: string | null | undefined;
};

function convertGqlDinoToDinosaur({
  name,
  description,
  imageUrl,
  trivia,
  ...dino
}: DbDino): Dinosaur {
  return {
    ...dino,
    description: description ?? '',
    imageUrl: imageUrl ?? '',
    dinoName: name ?? '',
    trivia: trivia ?? [],
  };
}

function convertGqlDinoToBaseDinosaur({
  name,
  description,
  ...dino
}: DbBaseDino): BaseDinosaur {
  return {
    ...dino,
    description: description ?? '',
    dinoName: name ?? '',
  };
}

function convertDinosaurToCreateDino({
  dinoName: name,
  ...dino
}: Dinosaur): DinosaurCreateInput {
  return { ...dino, name };
}
