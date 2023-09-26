import { Injectable, inject } from '@angular/core';
import { Suspense } from '@jscutlery/operators';
import { ComponentStore } from '@ngrx/component-store';
import {
  Observable,
  combineLatest,
  concatMap,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { DinosCrudService } from './dinos-crud.service';
import { BaseDinosaur } from './models/dinosaur';

type DinosCrudState = {
  dinosaurs: BaseDinosaur[];
  sortAscending: boolean;
};

const emptyState = (): DinosCrudState => ({
  dinosaurs: [],
  sortAscending: true,
});

@Injectable()
export class DinosCrudStoreService extends ComponentStore<DinosCrudState> {
  readonly #crudService = inject(DinosCrudService);

  readonly dinosaurs = this.selectSignal(({ dinosaurs }) => dinosaurs);
  readonly sortDirection$ = this.select(({ sortAscending }) =>
    sortAscending ? 'asc' : 'desc',
  );

  constructor() {
    super(emptyState());
  }

  readonly getTableDinos = this.effect((getDinos$) =>
    combineLatest([getDinos$, this.sortDirection$]).pipe(
      switchMap(([, sortDirection]) =>
        this.#crudService.getDinosTable(sortDirection),
      ),
      tap((response) => {
        if (response.hasError) {
          console.error('Error getting data', response.error);
        }
      }),
      filter(hasValue),
      map((response) => response.value.allDinosaurs),
      tap((dinosaurs) => {
        this.patchState({ dinosaurs });
      }),
    ),
  );

  readonly deleteDino = this.effect((deleteDino$: Observable<BaseDinosaur>) =>
    deleteDino$.pipe(
      map((dino) => dino.id),
      filter(isString),
      concatMap((dinoId) => this.#crudService.deleteDino(dinoId)),
      tap((response) => {
        if (response.hasError) {
          console.error('Error deleting dino', response.error);

          return;
        }

        this.getTableDinos();
      }),
    ),
  );

  readonly toggleSortDirection = this.effect((toggleSort$) =>
    toggleSort$.pipe(
      tap(() => {
        this.patchState(({ sortAscending }) => ({
          sortAscending: !sortAscending,
        }));
      }),
    ),
  );
}

const isString = (value: string | unknown | null): value is string =>
  value != null;

const hasValue = <T>(
  response: Suspense<T>,
): response is Suspense<T> & { hasValue: true } => {
  return response.hasValue;
};
