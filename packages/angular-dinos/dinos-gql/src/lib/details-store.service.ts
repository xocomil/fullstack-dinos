import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { create } from 'mutative';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { DinosCrudService } from './dinos-crud.service';
import { Dinosaur, createEmptyDino } from './models/dinosaur';

type DetailsState = {
  id: string | undefined;
  editMode: boolean;
  dinosaur: Dinosaur;
};

const emptyState = (): DetailsState => ({
  id: undefined,
  editMode: false,
  dinosaur: createEmptyDino(),
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
      tap((apolloDino) => {
        // console.log('apolloDino', apolloDino);

        this.patchState({
          dinosaur: apolloDino.data.dinosaur,
        });
      }),
    ),
  );

  setEditMode = this.updater(
    (state, editMode: boolean | undefined): DetailsState =>
      create(state, (draft) => {
        draft.editMode = !!editMode;
      }),
  );
}
