import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { withImmutableState } from '@angular-architects/ngrx-toolkit';
import { emptyDinosCrudState } from '../models/crud.state';
import { computed } from '@angular/core';

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
);
