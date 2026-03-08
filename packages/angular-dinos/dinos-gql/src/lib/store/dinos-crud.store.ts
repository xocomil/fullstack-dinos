import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import {
  rxMutation,
  switchOp,
  withImmutableState,
  withMutations,
} from '@angular-architects/ngrx-toolkit';
import { emptyDinosCrudState } from '../models/crud.state';
import { computed, effect, inject } from '@angular/core';
import { BaseDinosaur } from '../models/dinosaur';
import { DinosCrudService } from '../dinos-crud.service';
import { EMPTY } from 'rxjs';

export const DinosCrudStore = signalStore(
  withImmutableState(emptyDinosCrudState()),
  withComputed((state) => ({
    sortDirection: computed(() => (state.sortAscending() ? 'asc' : 'desc')),
    boolHasFeathersFilter: computed(() =>
      !state.hasFeathersFilter
        ? undefined
        : state.hasFeathersFilter() === 'true',
    ),
  })),
  withMethods((state) => ({
    toggleSortDirection: () => {
      patchState(state, {
        sortAscending: !state.sortAscending(),
      });
    },
    updateHasFeathersFilter: (filter: '' | 'true' | 'false') => {
      patchState(state, {
        hasFeathersFilter: filter,
      });
    },
  })),
  withMutations((state) => ({
    getTableDinos: rxMutation({
      operation: (_: void) => {
        const crudService = inject(DinosCrudService);

        return crudService.getDinosTable(
          state.sortDirection(),
          state.boolHasFeathersFilter(),
        );
      },
      onSuccess: (response) => {
        console.log('getTableDinos success response', response);

        const { allDinosaurs: dinosaurs } = response;

        patchState(state, { dinosaurs });
      },
      onError: (error) => {
        console.error('Error getting table dinos', error);
      },
      operator: switchOp,
    }),
  })),
  withMutations((state) => ({
    deleteDino: rxMutation({
      operation: ({ id: dinoId }: BaseDinosaur) => {
        const crudService = inject(DinosCrudService);

        if (!isString(dinoId)) {
          return EMPTY;
        }

        return crudService.deleteDino(dinoId);
      },
      onSuccess: (response) => {
        console.log('deleteDino success response', response);

        state.getTableDinos();
      },
      onError: (error) => {
        console.error('Error deleting dino', error);
      },
    }),
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        // Read the signals to establish tracking
        const sortDirection = store.sortDirection();
        const boolHasFeathersFilter = store.boolHasFeathersFilter();

        console.log(
          'sortDirection or hasFeathers changed',
          sortDirection,
          boolHasFeathersFilter,
        );

        // Trigger the mutation
        store.getTableDinos();
      });
    },
  }),
);

const isString = (value: string | unknown | null): value is string =>
  typeof value === 'string' && value != null;
