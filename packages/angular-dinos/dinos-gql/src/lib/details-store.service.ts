import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { create } from 'mutative';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { DinosCrudService } from './dinos-crud.service';
import { createEmptyDino, Dinosaur } from './models/dinosaur';

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

  readonly updateDino = this.effect((dino$: Observable<Dinosaur>) =>
    dino$.pipe(
      tap((dino) => {
        const errors = validateDino(dino);

        this.patchState({ errors });

        if (Object.keys(errors).length > 0) {
          return;
        }

        console.log('Saving dino...', dino);
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

const validateDino = (
  dino: Dinosaur,
): Partial<Record<keyof Dinosaur, string>> => {
  const errors: Partial<Record<keyof Dinosaur, string>> = {};

  if (dino.name?.length < 1) {
    errors.name = 'Name is required';
  }
  if (dino.species?.length < 1) {
    errors.species = 'Species is required';
  }

  return errors;
};
