import { Injectable, inject } from '@angular/core';
import { Suspense } from '@jscutlery/operators';
import { ComponentStore } from '@ngrx/component-store';
import { create } from 'mutative';
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
  hasFeathersFilter?: '' | 'true' | 'false';
};

const emptyState = (): DinosCrudState => ({
  dinosaurs: [],
  sortAscending: true,
  hasFeathersFilter: '',
});

@Injectable()
export class DinosCrudStoreService extends ComponentStore<DinosCrudState> {
  readonly #crudService = inject(DinosCrudService);

  readonly dinosaurs = this.selectSignal(({ dinosaurs }) => dinosaurs);
  readonly sortDirection$ = this.select(({ sortAscending }) =>
    sortAscending ? 'asc' : 'desc',
  );
  readonly hasFeathersFilter = this.selectSignal(
    ({ hasFeathersFilter }) => hasFeathersFilter,
  );
  readonly #boolFeathersFilter$ = this.select(({ hasFeathersFilter }) =>
    !hasFeathersFilter ? undefined : hasFeathersFilter === 'true',
  );

  constructor() {
    super(emptyState());
  }

  readonly getTableDinos = this.effect((getDinos$) =>
    combineLatest([
      getDinos$,
      this.sortDirection$,
      this.#boolFeathersFilter$,
    ]).pipe(
      switchMap(([, sortDirection, featherFilter]) =>
        this.#crudService.getDinosTable(sortDirection, featherFilter),
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

  readonly toggleSortDirection = this.updater(
    (state): DinosCrudState =>
      create(state, (draft) => {
        draft.sortAscending = !state.sortAscending;
      }),
  );

  readonly filterHasFeathers = this.updater(
    (state, hasFeathers: string): DinosCrudState =>
      create(state, (draft) => {
        // console.log('filterHasFeathers', filter);
        draft.hasFeathersFilter = hasFeathers as '' | 'true' | 'false';
      }),
  );
}

const isString = (value: string | unknown | null): value is string =>
  value != null;

const hasValue = <T>(
  response: Suspense<T>,
): response is Suspense<T> & { hasValue: true } => {
  return response.hasValue;
};
