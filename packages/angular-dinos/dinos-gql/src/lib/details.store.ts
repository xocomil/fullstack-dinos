import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { simpleDefaultState } from './models/details.state';

export const DetailsStore = signalStore(
  withState(simpleDefaultState()),
  withMethods((state) => ({
    setEditMode: (editMode: boolean | undefined) => {
      patchState(state, { editMode: editMode ?? false });
    },
  })),
);
