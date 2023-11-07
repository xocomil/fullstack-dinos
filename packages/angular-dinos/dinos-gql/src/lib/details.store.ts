import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { emptyState } from './models/details.state';

export const DetailsStore = signalStore(
  withState(emptyState()),
  withMethods((state) => ({
    setEditMode: (editMode: boolean | undefined) => {
      patchState(state, { editMode: editMode ?? false });
    },
  })),
);
