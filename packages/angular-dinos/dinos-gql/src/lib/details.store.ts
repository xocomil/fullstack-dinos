import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DinosCrudService } from './dinos-crud.service';
import { emptyState } from './models/details.state';

export const DetailsStore = signalStore(
  withState(emptyState()),
  withComputed(({ dinosaur }) => ({
    genusSpecies: computed(() => `${dinosaur.genus()} ${dinosaur.species()}`),
    displayTrivia: computed(() => dinosaur.trivia().length),
  })),
  withMethods((state) => {
    const dinosCrudService = inject(DinosCrudService);

    return {
      setEditMode: (editMode: boolean | undefined) => {
        patchState(state, { editMode: editMode ?? false });
      },
      setId: async (id: string | undefined) => {
        if (id == null) {
          return;
        }

        patchState(state, { id });

        const dino = await dinosCrudService.getDinoPromise(id);

        if (dino.hasValue) {
          patchState(state, { dinosaur: dino.value });
        }

        if (dino.hasError) {
          console.error('dino error', dino.error);
        }
      },
    };
  }),
);
