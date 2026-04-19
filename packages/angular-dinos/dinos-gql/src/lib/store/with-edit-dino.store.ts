import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OpenaiService } from '@fullstack-dinos/angular-dinos/openai';
import { logObservable } from '@fullstack-dinos/rxjs-operators';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, exhaustMap, filter, switchMap, tap } from 'rxjs';
import { DinosCrudService } from '../dinos-crud.service';
import { EditDinoState } from '../models/details.state';
import {
  Dinosaur,
  errorParser,
  OpenaiDino,
  UpdateDinosaur,
  validateUpdateDino,
} from '../models/dinosaur';
import {
  CallStateSlice,
  setError,
  setLoaded,
  setLoading,
} from './with-call-state.store';
import { withResource } from '@angular-architects/ngrx-toolkit';
import { rxResource } from '@angular/core/rxjs-interop';
import { createEmptyDino } from '../models/dinosaur';

export function withEditDino() {
  return signalStoreFeature(
    {
      state: type<EditDinoState & CallStateSlice>(),
    },
    withResource((state) => {
      const dinosCrudService = inject(DinosCrudService);

      return {
        dinosaur: rxResource({
          params: () => ({ id: state.id() }),
          defaultValue: createEmptyDino(),
          stream: ({ params: { id } }) =>
            id ? dinosCrudService.getDino(id) : EMPTY,
        }),
      };
    }),
    // TODO: use the resource properly instead of ?. operator
    withComputed((state) => ({
      displayTrivia: computed(() => state.dinosaurValue()?.trivia.length),
      genusSpecies: computed(
        () =>
          `${state.dinosaurValue()?.genus} ${state.dinosaurValue()?.species}`,
      ),
      cancelLink: computed(() => ['/dinos', state.id()]),
      openAiObject: computed<OpenaiDino>(() => {
        const { __typename, id, imageUrl, updatedAt, ...openAiObject } =
          state.dinosaurValue() as Dinosaur & { __typename: unknown };

        return { ...openAiObject, lengthInMeters: 0 };
      }),
      dinosaur: computed(() => {
        return state.dinosaurHasValue()
          ? state.dinosaurValue()!
          : createEmptyDino();
      }),
    })),
    withMethods((state) => {
      const dinosCrudService = inject(DinosCrudService);
      const router = inject(Router);
      const openaiService = inject(OpenaiService);
      const save = rxMethod<UpdateDinosaur>((dino$) =>
        dino$.pipe(
          // TODO: change into mutation
          switchMap((dino) => {
            const errors = validateUpdateDino(dino);

            if (Object.keys(errors).length > 0) {
              console.warn('Store-level validation failed:', errors);
              return EMPTY;
            }

            console.log('Saving dino...', dino);

            const id = state.dinosaurValue()?.id;

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
      );

      return {
        setEditMode: (editMode: boolean | undefined) => {
          patchState(state, { editMode: editMode ?? false });
        },
        setOpenAiMode: (openAiMode: boolean | undefined) => {
          patchState(state, { openAiMode: openAiMode ?? false });
        },
        setId: async (id: string | undefined) => {
          if (id == null) {
            return;
          }

          patchState(state, { id });
        },
        save,
        sendToOpenai: rxMethod<void>((dino$) =>
          dino$.pipe(
            logObservable('sendToOpenai'),
            exhaustMap(() => {
              console.log('sendToOpenai', state.openAiObject());

              patchState(state, setLoading());

              const dino = state.openAiObject();

              return openaiService.updateDino(dino);
            }),
            logObservable('sendToOpenai response'),
            tap((dinosaur) => {
              patchState(state, setLoaded());

              const {
                dinoName: name,
                genus: g2,
                species: s2,
                lengthInMeters,
                ...openaiDino
              } = dinosaur;

              if (openaiDino.heightInMeters < lengthInMeters) {
                openaiDino.heightInMeters = lengthInMeters;
              }

              save(openaiDino);
            }),
          ),
        ),
      };
    }),
  );
}
