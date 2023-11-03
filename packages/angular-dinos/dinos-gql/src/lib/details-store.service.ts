import { DestroyRef, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { create } from 'mutative';
import { EMPTY, filter, Observable, switchMap, tap } from 'rxjs';
import { SafeParseReturnType, z } from 'zod';
import { DinosCrudService } from './dinos-crud.service';
import { DetailsState, emptyState } from './models/details.state';
import {
  dinoParser,
  Dinosaur,
  updateDinoParser,
  UpdateDinosaur,
} from './models/dinosaur';

@Injectable()
export class DetailsStoreService extends ComponentStore<DetailsState> {
  readonly #dinosCrudService = inject(DinosCrudService);
  readonly #router = inject(Router);

  readonly dinosaur = this.selectSignal(({ dinosaur }) => dinosaur);
  readonly id = this.selectSignal(({ id }) => id);
  readonly editMode = this.selectSignal(({ editMode }) => editMode);
  readonly genusSpecies = this.selectSignal(
    this.dinosaur,
    ({ genus, species }) => `${genus} ${species}`,
  );
  readonly displayTrivia = this.selectSignal(
    this.dinosaur,
    ({ trivia }) => trivia.length,
  );
  readonly errors = this.selectSignal(({ errors }) => errors);
  readonly errorsArray = this.selectSignal(this.errors, (errors) =>
    Object.values(errors),
  );

  readonly showSaveSpinner = this.selectSignal(
    ({ savePending }) => savePending,
  );
  readonly networkError = this.selectSignal(({ networkError }) => networkError);

  constructor() {
    super(emptyState());

    inject(DestroyRef).onDestroy(() => {
      console.warn('Destroying DetailsStoreService...');
    });
  }

  readonly setId = this.effect((id$: Observable<string | undefined>) =>
    id$.pipe(
      filter(Boolean),
      tap((id) => {
        this.patchState({ id });
      }),
      switchMap((id) => this.#dinosCrudService.getDino(id)),
      tap((response) => {
        // console.log('apolloDino', apolloDino);

        if (response.hasValue) {
          this.patchState({
            dinosaur: response.value,
          });
        }

        if (response.hasError) {
          console.log('response.error', response.error);
        }
      }),
    ),
  );

  readonly setEditMode = this.updater(
    (state, editMode: boolean | undefined): DetailsState =>
      create(state, (draft) => {
        draft.editMode = !!editMode;
      }),
  );

  readonly updateDino = this.effect((dino$: Observable<Dinosaur>) =>
    dino$.pipe(
      switchMap((dino) => {
        const errors = validateUpdateDino(dino);

        console.log('errors', errors);

        this.patchState({ errors });

        if (Object.keys(errors).length > 0) {
          return EMPTY;
        }

        console.log('Saving dino...', dino);

        const id = this.id();

        if (!id) {
          console.error('No id found for dino', dino);
          return EMPTY;
        }

        return this.#dinosCrudService.updateDino(dino, id);
      }),
      tap((saveStatus) => {
        this.patchState({ savePending: saveStatus.pending });
      }),
      filter((saveStatus) => saveStatus.finalized),

      tap((result) => {
        console.log('result', result);

        if (result.hasValue) {
          this.#router.navigate(['dinos']);
        }

        if (result.hasError) {
          const errorWithMessage = errorParser.safeParse(result.error);

          if (errorWithMessage.success) {
            this.patchState({
              networkError: errorWithMessage.data.message,
            });

            return;
          }

          this.patchState({ networkError: `Unknown error: ${result.error}` });
        }
      }),
    ),
  );

  readonly createDino = this.effect((dino$: Observable<Dinosaur>) =>
    dino$.pipe(
      switchMap((dino) => {
        const errors = validateDino(dino);

        console.log('errors', errors);

        this.patchState({ errors });

        if (Object.keys(errors).length > 0) {
          return EMPTY;
        }

        console.log('Saving dino...', dino);

        return this.#dinosCrudService.create(dino);
      }),
      tap((saveStatus) => {
        this.patchState({ savePending: saveStatus.pending });
      }),
      filter((saveStatus) => saveStatus.finalized),
      tap((result) => {
        console.log('result', result);

        if (result.hasValue) {
          this.#router.navigate(['dinos']);
        }

        if (result.hasError) {
          const errorWithMessage = errorParser.safeParse(result.error);

          if (errorWithMessage.success) {
            this.patchState({
              networkError: errorWithMessage.data.message,
            });

            return;
          }

          this.patchState({ networkError: `Unknown error: ${result.error}` });
        }
      }),
    ),
  );

  readonly clearErrors = this.updater(
    (state): DetailsState =>
      create(state, (draft) => {
        draft.errors = {};
      }),
  );
}

const errorParser = z.object({
  message: z.string(),
});

const formatDinoErrors = <T, U>(parseResults: SafeParseReturnType<T, U>) =>
  parseResults.success
    ? {}
    : parseResults.error.issues.reduce(
        (acc, issue) => {
          return { ...acc, [issue.path[0]]: issue.message };
        },
        {} as Partial<Record<keyof Dinosaur, string>>,
      );

const validateDino = (
  dino: Dinosaur,
): Partial<Record<keyof Dinosaur, string>> => {
  console.log('dino', dino);

  const dinoResult = dinoParser.safeParse(dino);

  return formatDinoErrors(dinoResult);
};

const validateUpdateDino = (
  dino: UpdateDinosaur,
): Partial<Record<keyof UpdateDinosaur, string>> => {
  console.log('dino', dino);

  const dinoResult = updateDinoParser.safeParse(dino);

  // console.log('dinoResult', dinoResult);
  // if (!dinoResult.success) {
  //   console.log('dinoResult.error.issues', dinoResult.error.issues);
  //   console.log('dinoResult.error.formErrors', dinoResult.error.formErrors);
  //   console.log('dinoResult.error.flatten', dinoResult.error.flatten());
  //   console.log('dinoResult.error.formatted', dinoResult.error.format());
  // }

  return formatDinoErrors(dinoResult);
};
