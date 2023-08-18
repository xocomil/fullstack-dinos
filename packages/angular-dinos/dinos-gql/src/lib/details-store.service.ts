import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { DinosCrudService } from './dinos-crud.service';
import { Dinosaur, createEmptyDino } from './models/dinosaur';

type DetailsState = {
  id: string | undefined;
  dinosaur: Dinosaur;
};

const emptyState = (): DetailsState => ({
  id: undefined,
  dinosaur: createEmptyDino(),
});

@Injectable()
export class DetailsStoreService extends ComponentStore<DetailsState> {
  readonly #dinosCrudService = inject(DinosCrudService);

  readonly dinosaur = this.selectSignal(({ dinosaur }) => dinosaur);
  readonly id = this.selectSignal(({ id }) => id);

  constructor() {
    super(emptyState());
  }

  readonly setId = this.effect((id$: Observable<string>) =>
    id$.pipe(
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
}
