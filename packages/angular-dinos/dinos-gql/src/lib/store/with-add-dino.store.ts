import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, filter, switchMap, tap } from 'rxjs';
import { DinosCrudService } from '../dinos-crud.service';
import { AddDinoState } from '../models/details.state';
import { Dinosaur, errorParser, validateDino } from '../models/dinosaur';
import {
  CallStateSlice,
  setError,
  setLoaded,
  setLoading,
} from './with-call-state.store';
import { ErrorsSlice, updateDinoErrors } from './with-dino-errors.store';

export function withAddDino() {
  return signalStoreFeature(
    {
      state: type<AddDinoState & ErrorsSlice<Dinosaur> & CallStateSlice>(),
    },
    withState(() => ({ cancelLink: ['/dinos'], editMode: false })),
    withMethods((state) => {
      const dinosCrudService = inject(DinosCrudService);
      const router = inject(Router);

      return {
        save: rxMethod<Dinosaur>((dino$) =>
          dino$.pipe(
            switchMap((dino) => {
              const errors = validateDino(dino);

              console.log('errors', errors);

              patchState(state, updateDinoErrors(errors));

              if (Object.keys(errors).length > 0) {
                return EMPTY;
              }

              console.log('Saving dino...', dino);

              return dinosCrudService.create(dino);
            }),
            tap((saveStatus) => {
              patchState(state, setLoading());
            }),
            filter((saveStatus) => saveStatus.finalized),
            tap((result) => {
              console.log('result', result);

              if (result.hasValue) {
                patchState(state, setLoaded());

                void router.navigate(['dinos']);
              }

              if (result.hasError) {
                const errorWithMessage = errorParser.safeParse(result.error);

                if (errorWithMessage.success) {
                  patchState(state, {
                    networkError: errorWithMessage.data.message,
                  });

                  patchState(state, setError(errorWithMessage.data.message));

                  return;
                }

                patchState(state, {
                  networkError: `Unknown error: ${result.error}`,
                });

                patchState(state, setError(`Unknown error: ${result.error}`));
              }
            }),
          ),
        ),
        saveAsync: async (dino: Dinosaur) => {
          const errors = validateDino(dino);

          console.log('errors', errors);

          patchState(state, updateDinoErrors(errors));

          if (Object.keys(errors).length) {
            return;
          }

          console.log('Saving dino...', dino);

          const result = await dinosCrudService.createDinoPromise(dino);

          patchState(state, setLoading());

          if (!result.finalized) {
            return;
          }

          console.log('result', result);

          if (result.hasValue) {
            patchState(state, setLoaded());

            void router.navigate(['dinos']);

            return;
          }

          if (result.hasError) {
            const errorWithMessage = errorParser.safeParse(result.error);

            if (errorWithMessage.success) {
              patchState(state, {
                networkError: errorWithMessage.data.message,
              });

              patchState(state, setError(errorWithMessage.data.message));

              return;
            }

            patchState(state, {
              networkError: `Unknown error: ${result.error}`,
            });

            patchState(state, setError(`Unknown error: ${result.error}`));
          }
        },
      };
    }),
  );
}
