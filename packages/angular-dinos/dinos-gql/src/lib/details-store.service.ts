import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { create } from 'mutative';
import { EMPTY, filter, Observable, switchMap, tap } from 'rxjs';
import { DinosCrudService } from './dinos-crud.service';
import {
  createEmptyDino,
  Dinosaur,
  updateDinoParser,
  UpdateDinosaur,
} from './models/dinosaur';

type DetailsState = {
  id: string | undefined;
  editMode: boolean;
  dinosaur: Dinosaur;
  errors: Partial<Record<keyof Dinosaur, string>>;
};

const emptyState = (): DetailsState => ({
  id: undefined,
  editMode: false,
  dinosaur: createEmptyDino(),
  errors: {},
});

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

  constructor() {
    super(emptyState());
  }

  readonly setId = this.effect((id$: Observable<string | undefined>) =>
    id$.pipe(
      filter(Boolean),
      tap((id) => {
        this.patchState({ id });
      }),
      switchMap((id) => this.#dinosCrudService.getDino(id)),
      tap((dinosaur) => {
        // console.log('apolloDino', apolloDino);

        this.patchState({
          dinosaur,
        });
      }),
    ),
  );

  readonly setEditMode = this.updater(
    (state, editMode: boolean | undefined): DetailsState =>
      create(state, (draft) => {
        draft.editMode = !!editMode;
      }),
  );

  readonly updateDino = this.effect((dino$: Observable<UpdateDinosaur>) =>
    dino$.pipe(
      switchMap((dino) => {
        const errors = validateUpdateDino(dino);

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
      tap((result) => {
        console.log('result', result);

        if (result) {
          this.#router.navigate(['dinos']);
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

  return dinoResult.success
    ? {}
    : dinoResult.error.issues.reduce(
        (acc, issue) => {
          return { ...acc, [issue.path[0]]: issue.message };
        },
        {} as Partial<Record<keyof Dinosaur, string>>,
      );
};
