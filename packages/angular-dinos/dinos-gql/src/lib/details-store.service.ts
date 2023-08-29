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

const hasValue = (value: string | undefined): boolean =>
  !!value && value.length > 0;

const UndefinedOrGreaterThanZero = (value: number | undefined): boolean => {
  if (value == null) {
    return true;
  }

  return value > 0;
};

const validateDino = (
  dino: Dinosaur,
): Partial<Record<keyof Dinosaur, string>> => {
  const errors: Partial<Record<keyof Dinosaur, string>> = {};

  if (!hasValue(dino.name)) {
    errors.name = 'Name is required';
  }
  if (!hasValue(dino.genus)) {
    console.log('checking genus', dino.genus, dino.genus?.length);

    errors.genus = 'Genus is required';
  }
  if (!hasValue(dino.species)) {
    errors.species = 'Species is required';
  }
  if (!UndefinedOrGreaterThanZero(dino.heightInMeters)) {
    errors.heightInMeters = 'Height must be greater than zero';
  }
  if (!UndefinedOrGreaterThanZero(dino.weightInKilos)) {
    errors.weightInKilos = 'Weight must be greater than zero';
  }

  console.log('errors', errors);

  return errors;
};
