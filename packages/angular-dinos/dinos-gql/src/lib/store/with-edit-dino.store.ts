import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OpenaiService } from '@fullstack-dinos/angular-dinos/openai';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, filter, of, switchMap, tap } from 'rxjs';
import { DinosCrudService } from '../dinos-crud.service';
import { EditDinoState } from '../models/details.state';
import {
  Dinosaur,
  OpenaiDino,
  errorParser,
  validateUpdateDino,
} from '../models/dinosaur';
import {
  CallStateSlice,
  setError,
  setLoaded,
  setLoading,
} from './with-call-state.store';
import { ErrorsSlice, updateDinoErrors } from './with-dino-errors.store';

export function withEditDino() {
  return signalStoreFeature(
    {
      state: type<EditDinoState & ErrorsSlice<Dinosaur> & CallStateSlice>(),
    },
    withComputed(({ dinosaur, id }) => ({
      displayTrivia: computed(() => dinosaur.trivia().length),
      genusSpecies: computed(() => `${dinosaur.genus()} ${dinosaur.species()}`),
      cancelLink: computed(() => ['/dinos', id()]),
      openAiObject: computed<OpenaiDino>(() => {
        const { __typename, id, imageUrl, updatedAt, ...openAiObject } =
          dinosaur() as Dinosaur & { __typename: unknown };

        return { ...openAiObject, lengthInMeters: 0 };
      }),
    })),
    withMethods((state) => {
      const dinosCrudService = inject(DinosCrudService);
      const router = inject(Router);
      const openaiService = inject(OpenaiService);

      return {
        setEditMode: (editMode: boolean | undefined) => {
          patchState(state, { editMode: editMode ?? false });
        },
        newOpenAiMode: (openAiMode: boolean | undefined) => {
          patchState(state, { openAiMode: openAiMode ?? false });
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
        save: rxMethod<Dinosaur>((dino$) =>
          dino$.pipe(
            switchMap((dino) => {
              const errors = validateUpdateDino(dino);

              console.log('errors', errors);

              patchState(state, updateDinoErrors(errors));

              if (Object.keys(errors).length > 0) {
                return EMPTY;
              }

              console.log('Saving dino...', dino);

              const id = state.dinosaur().id;

              if (!id) {
                console.error('No id found for dino', dino);
                return EMPTY;
              }

              return dinosCrudService.updateDino(dino, id);
            }),
            tap(() => {
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

                patchState(state, setError(`Unknown error: ${result.error}`));

                patchState(state, {
                  networkError: `Unknown error: ${result.error}`,
                });
              }
            }),
          ),
        ),
        sendToOpenai: rxMethod<void>((dino$) =>
          dino$.pipe(
            switchMap(() => {
              const dino = state.openAiObject();

              openaiService.updateDino();

              return of(dino);
            }),
          ),
        ),
      };
    }),
  );
}
